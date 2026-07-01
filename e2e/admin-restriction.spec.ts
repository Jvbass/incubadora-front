import { test, expect } from '@playwright/test';
import { apiRegisterAndLogin, apiLogin, apiCreateProject } from './helpers/api';
import { injectAuth } from './helpers/auth';
import { BASE_API_URL } from './helpers/constants';

const PREFIX = 'restr';
const RUN_ID = Date.now();

let adminToken = '';
let devAToken = '';
let reportId = 0;
let devAUsername = '';

test.describe('Admin — Restricción temporal de cuenta', () => {
  // Setup sin try-catch: si algo falla, el bloque falla de forma visible.
  test.beforeAll(async ({ request }) => {
    // Dev A: autor del contenido reportado (será restringido)
    const devA = {
      username: `${PREFIX}_a_${RUN_ID}`,
      email: `${PREFIX}_a_${RUN_ID}@e2e.test`,
      password: 'Password123!',
      firstName: 'RestrA',
      lastName: 'Autor',
    };
    devAUsername = devA.username;
    devAToken = await apiRegisterAndLogin(request, devA).catch(async () =>
      apiLogin(request, { username: devA.username, password: devA.password })
    );

    await apiCreateProject(request, devAToken, {
      title: `${PREFIX} Proyecto ${RUN_ID}`,
      subtitle: 'Proyecto para test de restricción E2E',
      description: 'Este proyecto será reportado y su autor restringido.',
      status: 'published',
    });

    // El proyecto reportable: usamos otro proyecto de A como objetivo del reporte
    const target = await apiCreateProject(request, devAToken, {
      title: `${PREFIX} Objetivo ${RUN_ID}`,
      subtitle: 'Objetivo del reporte',
      description: 'Contenido reportado por dev B.',
      status: 'published',
    });

    // Dev B: reporta el proyecto de A
    const devB = {
      username: `${PREFIX}_b_${RUN_ID}`,
      email: `${PREFIX}_b_${RUN_ID}@e2e.test`,
      password: 'Password123!',
      firstName: 'RestrB',
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
        description: 'E2E: reporte para test de restricción.',
      },
      headers: { Authorization: `Bearer ${devBToken}` },
    });
    if (!reportRes.ok())
      throw new Error(`No se pudo crear el reporte de setup: ${reportRes.status()}`);

    adminToken = await apiLogin(request, { username: 'admin', password: 'Admin123!' });

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

  test('admin restringe al autor desde el drawer y el enforcement lo bloquea', async ({ page }) => {
    await injectAuth(page, adminToken);
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

    // Abrir el formulario de restricción, elegir preset de 7 días y confirmar
    await drawer.getByRole('button', { name: /restringir autor/i }).click();
    await drawer.getByRole('button', { name: '7 días' }).click();
    await drawer.getByRole('button', { name: /confirmar/i }).click();

    // El audit trail debe registrar la acción RESTRICT (verdad vía API)
    await expect(async () => {
      const detailRes = await page.request.get(
        `${BASE_API_URL}/admin/reports/${reportId}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      expect(detailRes.ok()).toBeTruthy();
      const detail = await detailRes.json();
      const types = (detail.auditTrail as Array<{ actionType: string }>).map((a) => a.actionType);
      expect(types).toContain('RESTRICT');
    }).toPass({ timeout: 15000 });

    // Enforcement real: el autor restringido no puede publicar un proyecto → 403.
    // Se usa apiCreateProject porque manda el body válido completo (incl.
    // technologyIds); el guard de restricción vive en el service, DESPUÉS de la
    // validación del controller, así que un body inválido daría 400 y no probaría
    // el enforcement. El helper lanza un Error con el status en el mensaje.
    await expect(
      apiCreateProject(page.request, devAToken, {
        title: `${PREFIX} Bloqueado ${RUN_ID}`,
        subtitle: 'No debería crearse',
        description: 'El autor está restringido y no puede publicar.',
        status: 'published',
      })
    ).rejects.toThrow(/403/);
  });
});
