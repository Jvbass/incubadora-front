import { test, expect } from '@playwright/test';
import { apiRegisterAndLogin, apiLogin, apiCreateProject } from './helpers/api';
import { injectAuth } from './helpers/auth';
import { BASE_API_URL } from './helpers/constants';

const RUN_ID = Date.now();

interface ReportSetup {
  adminToken: string;
  devToken: string;
  devUsername: string;
  devPassword: string;
  reporterToken: string;
  reportId: number;
  projectSlug: string;
}

/**
 * Registra un dev autor + un dev reportero, publica un proyecto del autor,
 * lo reporta y devuelve el id del reporte PENDING resultante (vía cola admin).
 */
async function setupReportedAccount(
  request: import('@playwright/test').APIRequestContext,
  prefix: string
): Promise<ReportSetup> {
  const devPassword = 'Password123!';
  const devA = {
    username: `${prefix}_a_${RUN_ID}`,
    email: `${prefix}_a_${RUN_ID}@e2e.test`,
    password: devPassword,
    firstName: 'AcctA',
    lastName: 'Autor',
  };
  const devToken = await apiRegisterAndLogin(request, devA).catch(async () =>
    apiLogin(request, { username: devA.username, password: devA.password })
  );

  const target = await apiCreateProject(request, devToken, {
    title: `${prefix} Objetivo ${RUN_ID}`,
    subtitle: 'Objetivo del reporte',
    description: 'Contenido reportado por dev B en test de acciones de cuenta.',
    status: 'published',
  });

  const devB = {
    username: `${prefix}_b_${RUN_ID}`,
    email: `${prefix}_b_${RUN_ID}@e2e.test`,
    password: 'Password123!',
    firstName: 'AcctB',
    lastName: 'Reporter',
  };
  const devBToken = await apiRegisterAndLogin(request, devB).catch(async () =>
    apiLogin(request, { username: devB.username, password: devB.password })
  );

  const reportRes = await request.post(`${BASE_API_URL}/reports`, {
    data: {
      contentType: 'PROJECT',
      contentId: target.id,
      reason: 'SPAM',
      description: 'E2E: reporte para test de acciones de cuenta.',
    },
    headers: { Authorization: `Bearer ${devBToken}` },
  });
  if (!reportRes.ok())
    throw new Error(`No se pudo crear el reporte de setup: ${reportRes.status()}`);

  const adminToken = await apiLogin(request, { username: 'admin', password: 'Admin123!' });

  const reportsRes = await request.get(`${BASE_API_URL}/admin/reports`, {
    params: { status: 'PENDING' },
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (!reportsRes.ok())
    throw new Error(`No se pudo listar reportes PENDING: ${reportsRes.status()}`);
  const reports = await reportsRes.json();
  const ourReport = (reports as Array<{ id: number; contentAuthorUsername: string }>).find(
    (r) => r.contentAuthorUsername === devA.username
  );
  if (!ourReport)
    throw new Error('El reporte creado en el setup no apareció en la cola PENDING.');

  return {
    adminToken,
    devToken,
    devUsername: devA.username,
    devPassword,
    reporterToken: devBToken,
    reportId: ourReport.id,
    projectSlug: target.slug,
  };
}

async function openReportDrawer(page: import('@playwright/test').Page, reportId: number) {
  await page.goto('/admin');
  await page.waitForURL('/admin', { timeout: 15000 });

  // Ocultar el overlay de React Query Devtools (solo dev) que intercepta clicks.
  await page.addStyleTag({
    content: '.tsqd-parent-container { display: none !important; }',
  });

  await page.getByText('Reportes de contenido').waitFor({ timeout: 10000 });

  const reportCard = page.locator(`[data-report-id="${reportId}"]`);
  await expect(reportCard).toBeVisible({ timeout: 10000 });
  await reportCard.click();

  const drawer = page.locator('[data-testid="report-detail-drawer"]');
  await expect(drawer).toBeVisible({ timeout: 10000 });
  return drawer;
}

test.describe('Admin — Suspender / reactivar / eliminar cuenta desde el drawer', () => {
  test('admin suspende desde el drawer y el login del suspendido devuelve 403 diferenciado', async ({
    page,
    request,
  }) => {
    const setup = await setupReportedAccount(request, 'susp');
    await injectAuth(page, setup.adminToken);

    const drawer = await openReportDrawer(page, setup.reportId);

    await expect(drawer.locator('[data-testid="account-actions"]')).toBeVisible();
    await drawer.getByRole('button', { name: /suspender cuenta/i }).click();
    await drawer.getByRole('button', { name: /confirmar/i }).click();

    // El audit trail debe registrar SUSPEND (verdad vía API).
    await expect(async () => {
      const detailRes = await page.request.get(
        `${BASE_API_URL}/admin/reports/${setup.reportId}`,
        { headers: { Authorization: `Bearer ${setup.adminToken}` } }
      );
      expect(detailRes.ok()).toBeTruthy();
      const detail = await detailRes.json();
      const types = (detail.auditTrail as Array<{ actionType: string }>).map((a) => a.actionType);
      expect(types).toContain('SUSPEND');
      expect(detail.report.contentAuthorAccountStatus).toBe('SUSPENDED');
    }).toPass({ timeout: 15000 });

    // El badge de estado de cuenta debe mostrar "Suspendida".
    await expect(drawer.locator('[data-testid="account-status-badge"]')).toContainText(
      /suspendida/i
    );

    // Login real del usuario suspendido → 403 con mensaje diferenciado.
    const loginRes = await page.request.post(`${BASE_API_URL}/auth/login`, {
      data: { username: setup.devUsername, password: setup.devPassword },
    });
    expect(loginRes.status()).toBe(403);
    const loginBody = await loginRes.json();
    expect(String(loginBody.message ?? '')).toMatch(/suspendida/i);
  });

  test('admin reactiva la cuenta desde el drawer y el login vuelve a funcionar', async ({
    page,
    request,
  }) => {
    const setup = await setupReportedAccount(request, 'react');

    // Suspender por API para llegar directo al escenario de reactivación por UI.
    const suspendRes = await request.post(
      `${BASE_API_URL}/admin/reports/${setup.reportId}/suspend`,
      { headers: { Authorization: `Bearer ${setup.adminToken}` } }
    );
    if (!suspendRes.ok())
      throw new Error(`No se pudo suspender en el setup: ${suspendRes.status()}`);

    await injectAuth(page, setup.adminToken);
    const drawer = await openReportDrawer(page, setup.reportId);

    await expect(drawer.locator('[data-testid="account-status-badge"]')).toContainText(
      /suspendida/i
    );
    await drawer.getByRole('button', { name: /reactivar cuenta/i }).click();
    await drawer.getByRole('button', { name: /confirmar/i }).click();

    await expect(async () => {
      const detailRes = await page.request.get(
        `${BASE_API_URL}/admin/reports/${setup.reportId}`,
        { headers: { Authorization: `Bearer ${setup.adminToken}` } }
      );
      expect(detailRes.ok()).toBeTruthy();
      const detail = await detailRes.json();
      const types = (detail.auditTrail as Array<{ actionType: string }>).map((a) => a.actionType);
      expect(types).toContain('REACTIVATE');
      expect(detail.report.contentAuthorAccountStatus).toBe('ACTIVE');
    }).toPass({ timeout: 15000 });

    const loginRes = await page.request.post(`${BASE_API_URL}/auth/login`, {
      data: { username: setup.devUsername, password: setup.devPassword },
    });
    expect(loginRes.ok()).toBeTruthy();
  });

  test('admin elimina la cuenta: el contenido deja de verse y no se ofrece reactivar', async ({
    page,
    request,
  }) => {
    const setup = await setupReportedAccount(request, 'del');
    await injectAuth(page, setup.adminToken);

    const drawer = await openReportDrawer(page, setup.reportId);

    await drawer.getByRole('button', { name: /eliminar cuenta/i }).click();
    await expect(drawer.locator('[data-testid="delete-account-warning"]')).toBeVisible();

    // El botón de confirmar debe permanecer deshabilitado hasta tildar el checkbox.
    const confirmButton = drawer.getByRole('button', { name: /confirmar/i });
    await expect(confirmButton).toBeDisabled();
    await drawer.getByRole('checkbox').check();
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    await expect(async () => {
      const detailRes = await page.request.get(
        `${BASE_API_URL}/admin/reports/${setup.reportId}`,
        { headers: { Authorization: `Bearer ${setup.adminToken}` } }
      );
      expect(detailRes.ok()).toBeTruthy();
      const detail = await detailRes.json();
      const types = (detail.auditTrail as Array<{ actionType: string }>).map((a) => a.actionType);
      expect(types).toContain('DELETE_ACCOUNT');
      expect(detail.report.contentAuthorAccountStatus).toBe('DELETED');
    }).toPass({ timeout: 15000 });

    // Badge "Eliminada" y sin botones de cuenta (ni "Reactivar").
    await expect(drawer.locator('[data-testid="account-status-badge"]')).toContainText(
      /eliminada/i
    );
    await expect(
      drawer.getByRole('button', { name: /reactivar cuenta/i })
    ).toHaveCount(0);
    await expect(
      drawer.getByRole('button', { name: /suspender cuenta/i })
    ).toHaveCount(0);

    // El contenido del autor eliminado deja de verse: un tercero autenticado
    // (el reportero) ya no puede acceder al proyecto ocultado (403, project.status="hidden").
    const projectRes = await page.request.get(
      `${BASE_API_URL}/projects/${setup.projectSlug}`,
      { headers: { Authorization: `Bearer ${setup.reporterToken}` } }
    );
    expect(projectRes.status()).toBe(403);

    // Login del eliminado → 403 con mensaje diferenciado.
    const loginRes = await page.request.post(`${BASE_API_URL}/auth/login`, {
      data: { username: setup.devUsername, password: setup.devPassword },
    });
    expect(loginRes.status()).toBe(403);
    const loginBody = await loginRes.json();
    expect(String(loginBody.message ?? '')).toMatch(/eliminada/i);
  });
});
