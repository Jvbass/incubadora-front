import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getVerificationCode } from './api';

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
 * Completa la página /verify-email con el código real leído de la BD (C4).
 * Asume que el email ya viene precargado (location.state del registro).
 */
export async function verifyEmailViaUi(page: Page, email: string) {
  await page.waitForURL(/\/verify-email/, { timeout: 15000 });
  const code = getVerificationCode(email);
  await page.fill('#code', code);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/login/, { timeout: 15000 });
}

/**
 * Registra un usuario via UI, verifica su email (C4) y hace login.
 * Desde C4 el registro NO inicia sesión: redirige a /verify-email.
 */
export async function registerAndLogin(page: Page, userData: UserData) {
  await registerUser(page, userData);
  await verifyEmailViaUi(page, userData.email);
  await loginUser(page, { username: userData.username, password: userData.password });
}

/**
 * Registra, verifica, hace login via UI, y espera a que la página de inicio cargue.
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
  // Abrir el dropdown del usuario en el Navbar (el avatar es el único img[alt] del nav)
  await page.locator('nav img[alt]').click();
  await page.getByText('Cerrar Sesión').click();
  await expect(page).toHaveURL('/login');
}
