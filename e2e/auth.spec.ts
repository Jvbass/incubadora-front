import { test, expect } from '@playwright/test';
import { apiRegisterAndLogin } from './helpers/api';
import { injectAuth, verifyEmailViaUi } from './helpers/auth';

// Prefijo único para este archivo
const PREFIX = 'auth';
const RUN_ID = Date.now();

const CREDENTIALS = {
  password: 'Password123!',
};

test.describe('Autenticación', () => {
  test('should register, verify email and login (flujo C4 completo)', async ({ page }) => {
    const username = `${PREFIX}_reg_${RUN_ID}`;
    const email = `${username}@e2e.test`;
    await page.goto('/register');
    await page.fill('#username', username);
    await page.fill('#email', email);
    await page.fill('#password', CREDENTIALS.password);
    await page.fill('#firstName', 'Auth');
    await page.fill('#lastName', 'Tester');
    await page.click('button[type="submit"]');

    // C4: el registro NO inicia sesión — redirige a /verify-email con el email precargado
    await expect(page).toHaveURL(/\/verify-email/, { timeout: 15000 });
    await expect(page.locator('#email')).toHaveValue(email);

    // Completar la verificación con el código real y luego iniciar sesión
    await verifyEmailViaUi(page, email);
    await page.fill('#username', username);
    await page.fill('#password', CREDENTIALS.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/(home|dashboard|admin)/, { timeout: 15000 });
  });

  test('should show validation errors on empty register form', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[type="submit"]');

    // React Hook Form muestra errores inline
    await expect(page.getByText('El nombre de usuario es requerido')).toBeVisible();
    await expect(page.getByText('El correo electrónico es requerido')).toBeVisible();
    await expect(page.getByText('La contraseña es requerida')).toBeVisible();
    await expect(page.getByText('El nombre es requerido')).toBeVisible();
    await expect(page.getByText('El apellido es requerido')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page, request }) => {
    const username = `${PREFIX}_login_${RUN_ID}`;
    await apiRegisterAndLogin(request, {
      username,
      email: `${username}@e2e.test`,
      password: CREDENTIALS.password,
      firstName: 'Login',
      lastName: 'Tester',
    });

    await page.goto('/login');
    await page.fill('#username', username);
    await page.fill('#password', CREDENTIALS.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/(home|dashboard|admin)/, { timeout: 15000 });
    await expect(page.getByText(username)).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'usuario_inexistente_xyz_123456');
    await page.fill('#password', 'wrong_password_xyz');

    // Interceptar la respuesta del API antes de hacer click para no perder el toast
    const responsePromise = page.waitForResponse(
      resp => resp.url().includes('/auth/login'),
      { timeout: 15000 }
    );
    await page.click('button[type="submit"]');
    const response = await responsePromise;

    // El backend debe devolver un status de error (401, 403, etc.)
    expect(response.status()).toBeGreaterThanOrEqual(400);

    // El usuario debe seguir en /login (no fue redirigido)
    await expect(page).toHaveURL('/login');
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login', { timeout: 10000 });
  });

  test('should redirect unauthenticated user from home to login', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL('/login', { timeout: 10000 });
  });

  test('should logout and redirect to login', async ({ page, request }) => {
    const username = `${PREFIX}_logout_${RUN_ID}`;
    const token = await apiRegisterAndLogin(request, {
      username,
      email: `${username}@e2e.test`,
      password: CREDENTIALS.password,
      firstName: 'Logout',
      lastName: 'Tester',
    });

    await injectAuth(page, token);
    await page.goto('/');
    await page.waitForURL(/\/(home|dashboard|admin)/, { timeout: 15000 });

    // Abrir dropdown del usuario (clic en el trigger del navbar).
    // Se usa data-testid porque el avatar puede ser <img> o el fallback de
    // inicial (<div>) cuando el usuario no tiene foto, como los usuarios E2E.
    await page.getByTestId('user-menu-trigger').click();
    await page.getByText('Cerrar Sesión').click();

    await expect(page).toHaveURL('/login', { timeout: 10000 });
  });
});
