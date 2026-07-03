import { test, expect } from '@playwright/test';
import { apiRegisterAndLogin, apiLogin, apiCreateProject } from './helpers/api';
import { injectAuth } from './helpers/auth';
import { BASE_API_URL } from './helpers/constants';

const PREFIX = 'mod';
const RUN_ID = Date.now();

let adminToken = '';
let reportId = 0;
let devAUsername = '';

test.describe('Admin — Moderación de reportes', () => {
  // El setup NO atrapa errores: si algo falla (Docker/DB caídos, contrato roto),
  // el bloque entero falla de forma visible en vez de skippear silenciosamente.
  test.beforeAll(async ({ request }) => {
    // 1. Registrar y autenticar dev A (autor del contenido a reportar)
    const devA = {
      username: `${PREFIX}_a_${RUN_ID}`,
      email: `${PREFIX}_a_${RUN_ID}@e2e.test`,
      password: 'Password123!',
      firstName: 'ModA',
      lastName: 'Tester',
    };
    devAUsername = devA.username;
    const devAToken = await apiRegisterAndLogin(request, devA).catch(async () =>
      apiLogin(request, { username: devA.username, password: devA.password })
    );

    // 2. Dev A crea un proyecto publicado
    const project = await apiCreateProject(request, devAToken, {
      title: `${PREFIX} Proyecto Reportado ${RUN_ID}`,
      subtitle: 'Proyecto para test de moderación E2E',
      description: 'Este proyecto será reportado por otro usuario en el test E2E.',
      status: 'published',
    });

    // 3. Registrar y autenticar dev B (quien hace el reporte)
    const devB = {
      username: `${PREFIX}_b_${RUN_ID}`,
      email: `${PREFIX}_b_${RUN_ID}@e2e.test`,
      password: 'Password123!',
      firstName: 'ModB',
      lastName: 'Reporter',
    };
    const devBToken = await apiRegisterAndLogin(request, devB).catch(async () =>
      apiLogin(request, { username: devB.username, password: devB.password })
    );

    // 4. Dev B reporta el proyecto de dev A
    const reportRes = await request.post(`${BASE_API_URL}/reports`, {
      data: {
        contentType: 'PROJECT',
        contentId: project.id,
        reason: 'SPAM',
        description: 'E2E: reporte de moderación automatizado.',
      },
      headers: { Authorization: `Bearer ${devBToken}` },
    });
    if (!reportRes.ok())
      throw new Error(`No se pudo crear el reporte de setup: ${reportRes.status()}`);

    // 5. Login admin
    adminToken = await apiLogin(request, {
      username: 'admin',
      password: 'Admin123!',
    });

    // 6. Buscar el reporte recién creado (autor único por RUN_ID) para obtener su ID
    const reportsRes = await request.get(`${BASE_API_URL}/admin/reports`, {
      params: { status: 'PENDING' },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!reportsRes.ok())
      throw new Error(`No se pudo listar reportes PENDING: ${reportsRes.status()}`);

    const reports = await reportsRes.json();
    const ourReport = (reports as Array<{ id: number; contentAuthorUsername: string }>).find(
      (r) => r.contentAuthorUsername === devAUsername
    );
    if (!ourReport)
      throw new Error('El reporte creado en el setup no apareció en la cola PENDING.');
    reportId = ourReport.id;
  });

  test('admin reclama y resuelve un reporte desde el drawer (UI + API)', async ({ page }) => {
    await injectAuth(page, adminToken);
    await page.goto('/admin');
    await page.waitForURL('/admin', { timeout: 15000 });

    // Ocultar el overlay de React Query Devtools (solo dev): flota sobre el footer
    // del drawer e intercepta los clicks de los botones de acción.
    await page.addStyleTag({
      content: '.tsqd-parent-container { display: none !important; }',
    });

    await page.getByText('Reportes de contenido').waitFor({ timeout: 10000 });

    // Abrir el drawer del reporte exacto creado en el setup
    const reportCard = page.locator(`[data-report-id="${reportId}"]`);
    await expect(reportCard).toBeVisible({ timeout: 10000 });
    await reportCard.click();

    const drawer = page.locator('[data-testid="report-detail-drawer"]');
    await expect(drawer).toBeVisible({ timeout: 10000 });

    // El badge de estado del header refleja el estado actual del reporte
    const statusBadge = drawer.getByTestId('drawer-status-badge');

    // --- Reclamar (PENDING → IN_REVIEW) --- (clicks scopeados al drawer)
    await drawer.getByRole('button', { name: /reclamar/i }).click();
    await expect(statusBadge).toHaveText('En revisión', { timeout: 15000 });

    // --- Resolver (IN_REVIEW → RESOLVED) ---
    await drawer.getByRole('button', { name: /resolver/i }).click();
    // El form de nota inline aparece (nota opcional para resolve); confirmar sin nota
    await drawer.getByRole('button', { name: /confirmar/i }).click();
    await expect(statusBadge).toHaveText('Resuelto', { timeout: 15000 });

    // El footer indica reporte cerrado
    await expect(drawer.getByText(/cerrado/i)).toBeVisible({ timeout: 5000 });

    // --- Verdad de fondo vía API: estado + audit trail ---
    const detailRes = await page.request.get(
      `${BASE_API_URL}/admin/reports/${reportId}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    expect(detailRes.ok()).toBeTruthy();
    const detail = await detailRes.json();
    expect(detail.report.status).toBe('RESOLVED');
    const actionTypes = (detail.auditTrail as Array<{ actionType: string }>).map(
      (a) => a.actionType
    );
    expect(actionTypes).toContain('CLAIM');
    expect(actionTypes).toContain('RESOLVE');

    // Ya no aparece en la cola PENDING
    const pendingRes = await page.request.get(`${BASE_API_URL}/admin/reports`, {
      params: { status: 'PENDING' },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(pendingRes.ok()).toBeTruthy();
    const pending = await pendingRes.json();
    expect((pending as Array<{ id: number }>).some((r) => r.id === reportId)).toBeFalsy();
  });
});
