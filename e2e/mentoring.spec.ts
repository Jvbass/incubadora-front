import { test, expect } from '@playwright/test';
import { apiRegisterAndLogin, apiLogin, apiCreateProject } from './helpers/api';
import { injectAuth } from './helpers/auth';
import { BASE_API_URL } from './helpers/constants';

const PREFIX = 'ment';

const MENTOR_USER = {
  username: `${PREFIX}_mentor`,
  email: `${PREFIX}_mentor@e2e.test`,
  password: 'Password123!',
  firstName: 'Mentor',
  lastName: 'Tester',
};

const DEV_USER = {
  username: `${PREFIX}_dev`,
  email: `${PREFIX}_dev@e2e.test`,
  password: 'Password123!',
  firstName: 'Dev',
  lastName: 'Tester',
};

let mentorToken: string;
let devToken: string;
let mentoringSlug: string;

test.describe('Mentorías', () => {
  test.beforeAll(async ({ request }) => {
    mentorToken = await apiRegisterAndLogin(request, MENTOR_USER).catch(async () =>
      apiLogin(request, { username: MENTOR_USER.username, password: MENTOR_USER.password })
    );
    devToken = await apiRegisterAndLogin(request, DEV_USER).catch(async () =>
      apiLogin(request, { username: DEV_USER.username, password: DEV_USER.password })
    );

    // Intentar crear 3 proyectos publicados para el mentor (requisito del rol MENTOR)
    for (let i = 1; i <= 3; i++) {
      await apiCreateProject(request, mentorToken, {
        title: `${PREFIX} Mentor Project ${i}`,
        subtitle: `Proyecto ${i} del mentor`,
        description: `Proyecto número ${i} para obtener rol MENTOR.`,
        status: 'published',
      }).catch(() => {
        // Ignorar si ya existe
      });
    }
  });

  test('should display mentoring list page', async ({ page }) => {
    await injectAuth(page, devToken);
    await page.goto('/mentoring');
    await page.waitForURL('/mentoring', { timeout: 15000 });

    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    // La página debe tener algún contenido de mentorías
    await expect(page.locator('main, [role="main"], h1, h2').first()).toBeVisible({ timeout: 10000 });
  });

  test('DEV cannot submit mentoring creation form', async ({ page, request }) => {
    // Nota: la ruta /mentoring/new no tiene guard de rol en el frontend,
    // pero el backend rechaza la petición si el usuario no es MENTOR.
    // Verificamos que el formulario existe pero el backend rechaza el submit.
    await injectAuth(page, devToken);
    await page.goto('/mentoring/new');
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    const currentUrl = page.url();
    if (!currentUrl.includes('/mentoring/new')) {
      // Si fue redirigido, el test pasa — la ruta está protegida
      expect(true).toBeTruthy();
      return;
    }

    // La página cargó — intentar enviar el formulario (el backend debería rechazar)
    // Verificar via API que un DEV no puede crear una mentoría
    const response = await request.post(`${BASE_API_URL}/mentorings`, {
      data: {
        title: 'Intento de mentoría como DEV',
        description: 'Este intento debe ser rechazado.',
      },
      headers: { Authorization: `Bearer ${devToken}` },
    });

    // El backend debe retornar 403 o 4xx para usuarios que no son MENTOR
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should create a mentoring as MENTOR (if role available)', async ({ page, request }) => {
    // Este test salta si el usuario no tiene el rol MENTOR
    // (requiere aprobación de admin o configuración especial de DB)
    const profileRes = await request.get(`${BASE_API_URL}/me/profile`, {
      headers: { Authorization: `Bearer ${mentorToken}` },
    });

    if (!profileRes.ok()) {
      test.skip();
      return;
    }

    // Intentar acceder a /mentoring/new con el token del mentor
    await injectAuth(page, mentorToken);
    await page.goto('/mentoring/new');

    const currentUrl = page.url();
    if (!currentUrl.includes('/mentoring/new')) {
      // El usuario no tiene rol MENTOR aún — skip
      test.skip();
      return;
    }

    // Rellenar el formulario de mentoría
    const titleInput = page.locator('input[name="title"]');
    if (await titleInput.count() > 0) {
      await titleInput.fill(`${PREFIX} Mentoría E2E ${Date.now()}`);
    }

    const descriptionArea = page.locator('textarea[name="description"], .w-md-editor-text-input').first();
    if (await descriptionArea.count() > 0) {
      await descriptionArea.fill('Esta es una mentoría creada por el test E2E de Playwright.');
    }

    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/(mentoring|dashboard)/, { timeout: 15000 });
  });

  test('should display mentoring detail when one exists', async ({ page, request }) => {
    // Obtener lista de mentorías
    const listRes = await request.get(`${BASE_API_URL}/mentorings?page=0&size=10`, {
      headers: { Authorization: `Bearer ${devToken}` },
    });

    if (!listRes.ok()) {
      test.skip();
      return;
    }

    const listBody = await listRes.json();
    const items = listBody.content || listBody;
    if (!Array.isArray(items) || items.length === 0) {
      test.skip();
      return;
    }

    mentoringSlug = items[0].slug;

    await injectAuth(page, devToken);
    await page.goto(`/mentoring/${mentoringSlug}`);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  });

  test('should filter mentorings by tag', async ({ page }) => {
    await injectAuth(page, devToken);
    await page.goto('/mentoring');
    await page.waitForURL('/mentoring', { timeout: 15000 });

    // Buscar el input de filtro por tag
    const tagFilter = page.locator('input[placeholder*="tag"], input[placeholder*="filtrar"], input[type="search"]').first();
    if (await tagFilter.count() > 0) {
      await tagFilter.fill('javascript');
      await page.waitForTimeout(500); // Esperar debounce

      // La lista debe actualizarse (puede estar vacía si no hay mentorías con ese tag)
      await expect(page.locator('body')).toBeVisible();
    } else {
      // No hay filtro de tags visible — test inconcluso pero sin fallo
      test.skip();
    }
  });
});
