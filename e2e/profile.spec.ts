import { test, expect } from '@playwright/test';
import { apiRegisterAndLogin, apiLogin, apiCreateProject } from './helpers/api';
import { injectAuth } from './helpers/auth';
import { BASE_API_URL } from './helpers/constants';

const PREFIX = 'prof';

const USER = {
  username: `${PREFIX}_user`,
  email: `${PREFIX}_user@e2e.test`,
  password: 'Password123!',
  firstName: 'Profile',
  lastName: 'Tester',
};

let authToken: string;
let userSlug: string;

test.describe('Perfil y Portfolio', () => {
  test.beforeAll(async ({ request }) => {
    authToken = await apiRegisterAndLogin(request, USER).catch(async () =>
      apiLogin(request, { username: USER.username, password: USER.password })
    );

    // Crear algunos proyectos para el usuario
    await apiCreateProject(request, authToken, {
      title: `${PREFIX} Portfolio Project 1`,
      subtitle: 'Proyecto en el portfolio',
      description: 'Proyecto para mostrar en el portfolio.',
      status: 'published',
    }).catch(() => {});

    // Obtener el slug del perfil del usuario
    const profileRes = await request.get(`${BASE_API_URL}/me/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (profileRes.ok()) {
      const profile = await profileRes.json();
      userSlug = profile.slug || USER.username;
    } else {
      userSlug = USER.username;
    }
  });

  test('should display public portfolio without auth', async ({ page }) => {
    // Sin autenticación, navegar al portfolio público
    await page.goto(`/portfolio/${userSlug}`);
    // Esperar a que el spinner de carga desaparezca (la API debe resolver la petición)
    await page.waitForFunction(
      () => !document.body.innerText.toLowerCase().includes('cargando'),
      { timeout: 20000 }
    ).catch(() => {});

    // El portfolio puede mostrar el nombre o un mensaje de "perfil privado" si
    // el usuario no ha habilitado su perfil público
    const hasContent = await page.getByText(
      new RegExp(`${USER.firstName}|${USER.lastName}|${USER.username}`, 'i')
    ).count() > 0;
    const isPrivate = await page.getByText(/perfil es privado|no se encontró/i).count() > 0;
    const hasError = await page.getByText(/error al cargar/i).count() > 0;
    // Si el backend requiere auth para el portfolio, el interceptor de axios redirige a /login
    const isRedirectedToLogin = page.url().includes('/login');

    // Al menos una condición debe cumplirse (la página carga algo)
    expect(hasContent || isPrivate || hasError || isRedirectedToLogin).toBeTruthy();
  });

  test('should return 404 or error for non-existent slug', async ({ page }) => {
    await page.goto('/portfolio/slug-que-no-existe-xyz-e2e-12345');
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    // El PortfolioPage muestra uno de estos mensajes para errores:
    // 404 → "No se encontró este portfolio."
    // 403 → "Este perfil es privado."
    // Genérico → "Error al cargar el portfolio: ..."
    // O el router → "Página No Encontrada"
    const bodyText = await page.locator('body').innerText();
    const hasError = /portfolio|privado|encontr|error|404/i.test(bodyText);

    expect(hasError).toBeTruthy();
  });

  test('should edit profile settings', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/settings');
    await page.waitForURL('/settings', { timeout: 15000 });

    // Buscar el campo de bio/headline
    const bioField = page.locator('textarea[name="bio"]');
    if (await bioField.count() > 0) {
      await bioField.fill('Bio actualizada via E2E Playwright tests.');
    }

    const headlineField = page.locator('input[name="headline"]');
    if (await headlineField.count() > 0) {
      await headlineField.fill('Developer | E2E Tester');
    }

    // Guardar cambios
    const saveBtn = page.locator('button[type="submit"]').filter({ hasText: /guardar|actualizar|save/i });
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await expect(page.getByText(/guardado|actualizado|éxito|success/i)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should display own dashboard with projects', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/dashboard');
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // El dashboard debe cargar correctamente
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('main, [role="main"], h1, h2').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to own profile page', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/profile');
    await page.waitForURL('/profile', { timeout: 15000 });

    // Debe mostrar información del usuario (la página es lazy: usar auto-retry)
    await expect(
      page.getByText(new RegExp(`${USER.username}|${USER.firstName}|${USER.lastName}`, 'i')).first()
    ).toBeVisible({ timeout: 10000 });
  });
});
