import { test, expect } from '@playwright/test';
import { apiRegisterAndLogin, apiLogin } from './helpers/api';
import { injectAuth } from './helpers/auth';

const PREFIX = 'nav';

const USER = {
  username: `${PREFIX}_user`,
  email: `${PREFIX}_user@e2e.test`,
  password: 'Password123!',
  firstName: 'Nav',
  lastName: 'Tester',
};

let authToken: string;

test.describe('Navegación', () => {
  test.beforeAll(async ({ request }) => {
    authToken = await apiRegisterAndLogin(request, USER).catch(async () =>
      apiLogin(request, { username: USER.username, password: USER.password })
    );
  });

  test('should navigate to projects (home) from sidebar', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/home');
    await page.waitForURL('/home', { timeout: 15000 });

    // El sidebar tiene el link "Proyectos" como un <Link> (anchor) apuntando a /home
    // Usamos locator('a') para evitar strict mode con múltiples "Proyectos" en la página
    await page.locator('a[href="/home"]').first().click();
    await expect(page).toHaveURL('/home', { timeout: 10000 });
  });

  test('should navigate to mentoring from sidebar', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/home');
    await page.waitForURL('/home', { timeout: 15000 });

    // El sidebar tiene el link "Mentorías" apuntando a /mentoring
    await page.locator('a[href="/mentoring"]').first().click();
    await expect(page).toHaveURL('/mentoring', { timeout: 10000 });
  });

  test('should navigate to dashboard from navbar dropdown', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/home');
    await page.waitForURL('/home', { timeout: 15000 });

    // Abrir dropdown del usuario en el navbar
    const userAvatar = page.locator('nav img[alt]');
    if (await userAvatar.count() > 0) {
      await userAvatar.click();
    } else {
      // Alternativa: buscar el elemento del usuario
      await page.locator('nav').getByText(USER.username).click();
    }

    await page.getByText('Panel').click();
    await expect(page).toHaveURL(/\/(dashboard|admin)/, { timeout: 10000 });
  });

  test('should navigate to profile from navbar dropdown', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/home');
    await page.waitForURL('/home', { timeout: 15000 });

    // Abrir dropdown del usuario
    const userAvatar = page.locator('nav img[alt]');
    if (await userAvatar.count() > 0) {
      await userAvatar.click();
    } else {
      await page.locator('nav').getByText(USER.username).click();
    }

    await page.getByText('Mi Perfil').click();
    await expect(page).toHaveURL('/profile', { timeout: 10000 });
  });

  test('should navigate to create project from navbar', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/home');
    await page.waitForURL('/home', { timeout: 15000 });

    // El botón "Crear" en el navbar lleva a /projects/new
    await page.getByText('Crear').click();
    await expect(page).toHaveURL('/projects/new', { timeout: 10000 });
  });

  test('should show 404 page for unknown routes', async ({ page }) => {
    await page.goto('/ruta-que-no-existe-e2e-xyz');

    // El router tiene <Route path="*"> → <NotFound /> (lazy: esperar con auto-retry
    // a que el chunk cargue, no usar count() inmediato)
    await expect(
      page.getByText(/404|no encontrada|not found|página no existe/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show NotFound for authenticated user on unknown route', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/esta-ruta-no-existe');

    await expect(
      page.getByText(/404|no encontrada|not found|página no existe/i).first()
    ).toBeVisible({ timeout: 10000 });
  });
});
