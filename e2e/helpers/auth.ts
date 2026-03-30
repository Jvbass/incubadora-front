import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

interface UserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Rellena el formulario de registro y lo envía.
 */
export async function registerUser(page: Page, userData: UserData) {
  await page.goto('/register');
  await page.fill('#username', userData.username);
  await page.fill('#email', userData.email);
  await page.fill('#password', userData.password);
  await page.fill('#firstName', userData.firstName);
  await page.fill('#lastName', userData.lastName);
  await page.click('button[type="submit"]');
}

/**
 * Rellena el formulario de login y lo envía.
 */
export async function loginUser(page: Page, credentials: LoginCredentials) {
  await page.goto('/login');
  await page.fill('#username', credentials.username);
  await page.fill('#password', credentials.password);
  await page.click('button[type="submit"]');
}

/**
 * Registra un usuario via UI y luego hace login.
 */
export async function registerAndLogin(page: Page, userData: UserData) {
  await registerUser(page, userData);
  // Después del registro exitoso, el usuario es redirigido automáticamente
  // (el hook registerAndLogin hace register + login en secuencia)
}

/**
 * Registra, hace login via UI, y espera a que la página de inicio cargue.
 */
export async function setupAuthenticatedUser(page: Page, userData: UserData) {
  await registerAndLogin(page, userData);
  // Esperar a que la redirección basada en rol ocurra (DEV → /home)
  await page.waitForURL(/\/(home|dashboard|admin)/, { timeout: 15000 });
}

/**
 * Inyecta el token JWT directamente en localStorage y navega a la app.
 * Más rápido que hacer login por UI — ideal para tests que no prueban el login.
 */
export async function injectAuth(page: Page, token: string) {
  // addInitScript se ejecuta antes que los scripts de la página,
  // por lo que el store de Zustand leerá el token al inicializarse.
  await page.addInitScript((tok) => {
    localStorage.setItem('authToken', tok);
  }, token);
}

/**
 * Cierra sesión via UI y espera la redirección a /login.
 */
export async function logoutUser(page: Page) {
  // Abrir el dropdown del usuario en el Navbar
  await page.locator('nav').getByText(/\w+/).first().click();
  await page.getByText('Cerrar Sesión').click();
  await expect(page).toHaveURL('/login');
}
