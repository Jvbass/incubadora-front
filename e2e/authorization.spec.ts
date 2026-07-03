import { test, expect } from '@playwright/test';
import { apiLogin, apiRegisterAndLogin } from './helpers/api';
import { injectAuth } from './helpers/auth';

/**
 * Tests de autorización por rol: verifica que cada rol sea redirigido al landing
 * correspondiente cuando intenta acceder a una ruta fuera de sus permisos, y que
 * las rutas permitidas no generen redirecciones.
 *
 * Cuentas seed utilizadas:
 *   admin       / Admin123!   → ADMINISTRATOR
 *   seed-mentor / Mentor123!  → MENTOR
 *   steve-wozniak / Dev123!   → RECRUITER
 *   authz_dev_user (registrado en beforeAll) → DEV
 */

const PREFIX = 'authz';

const DEV_USER = {
  username: `${PREFIX}_dev_user`,
  email: `${PREFIX}_dev_user@e2e.test`,
  password: 'Password123!',
  firstName: 'Authz',
  lastName: 'DevUser',
};

let adminToken: string;
let mentorToken: string;
let recruiterToken: string;
let devToken: string;

test.describe('Autorización por rol', () => {
  test.beforeAll(async ({ request }) => {
    // Seed accounts must exist; if any login fails the error propagates and the
    // suite fails loudly instead of producing silent skips / false-greens.
    adminToken = await apiLogin(request, { username: 'admin', password: 'Admin123!' });
    mentorToken = await apiLogin(request, { username: 'seed-mentor', password: 'Mentor123!' });
    recruiterToken = await apiLogin(request, { username: 'steve-wozniak', password: 'Dev123!' });

    // DEV uses a dynamically registered account with a login fallback.
    devToken = await apiRegisterAndLogin(request, DEV_USER).catch(async () =>
      apiLogin(request, { username: DEV_USER.username, password: DEV_USER.password })
    );
  });

  // ── RECRUITER ──────────────────────────────────────────────────────────────
  // El landing de RECRUITER es /recruiter-dashboard.

  test('RECRUITER → /admin redirige a /recruiter-dashboard', async ({ page }) => {
    await injectAuth(page, recruiterToken);
    await page.goto('/admin');
    await expect(page).toHaveURL('/recruiter-dashboard', { timeout: 10000 });
  });

  test('RECRUITER → /dashboard redirige a /recruiter-dashboard', async ({ page }) => {
    await injectAuth(page, recruiterToken);
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/recruiter-dashboard', { timeout: 10000 });
  });

  test('RECRUITER → /home redirige a /recruiter-dashboard', async ({ page }) => {
    await injectAuth(page, recruiterToken);
    await page.goto('/home');
    await expect(page).toHaveURL('/recruiter-dashboard', { timeout: 10000 });
  });

  test('RECRUITER → /mentoring/new redirige a /recruiter-dashboard', async ({ page }) => {
    await injectAuth(page, recruiterToken);
    await page.goto('/mentoring/new');
    await expect(page).toHaveURL('/recruiter-dashboard', { timeout: 10000 });
  });

  test('RECRUITER → /recruiter-dashboard está permitido', async ({ page }) => {
    await injectAuth(page, recruiterToken);
    await page.goto('/recruiter-dashboard');
    await expect(page).toHaveURL('/recruiter-dashboard', { timeout: 15000 });
  });

  // ── DEV ────────────────────────────────────────────────────────────────────
  // El landing de DEV es /home.

  test('DEV → /admin redirige a /home', async ({ page }) => {
    if (!devToken) {
      test.skip();
      return;
    }
    await injectAuth(page, devToken);
    await page.goto('/admin');
    await expect(page).toHaveURL('/home', { timeout: 10000 });
  });

  test('DEV → /recruiter-dashboard redirige a /home', async ({ page }) => {
    if (!devToken) {
      test.skip();
      return;
    }
    await injectAuth(page, devToken);
    await page.goto('/recruiter-dashboard');
    await expect(page).toHaveURL('/home', { timeout: 10000 });
  });

  test('DEV → /mentoring/new redirige a /home', async ({ page }) => {
    if (!devToken) {
      test.skip();
      return;
    }
    await injectAuth(page, devToken);
    await page.goto('/mentoring/new');
    await expect(page).toHaveURL('/home', { timeout: 10000 });
  });

  // ── MENTOR ─────────────────────────────────────────────────────────────────
  // El landing de MENTOR es /dashboard.

  test('MENTOR → /admin redirige a /dashboard', async ({ page }) => {
    await injectAuth(page, mentorToken);
    await page.goto('/admin');
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('MENTOR → /recruiter-dashboard redirige a /dashboard', async ({ page }) => {
    await injectAuth(page, mentorToken);
    await page.goto('/recruiter-dashboard');
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('MENTOR → /mentoring/new está permitido (no redirige)', async ({ page }) => {
    await injectAuth(page, mentorToken);
    await page.goto('/mentoring/new');
    await expect(page).toHaveURL('/mentoring/new', { timeout: 15000 });
  });

  // ── ADMINISTRATOR ──────────────────────────────────────────────────────────
  // ADMINISTRATOR puede acceder a todas las rutas rol-exclusivas.

  test('ADMIN → /recruiter-dashboard está permitido', async ({ page }) => {
    await injectAuth(page, adminToken);
    await page.goto('/recruiter-dashboard');
    await expect(page).toHaveURL('/recruiter-dashboard', { timeout: 15000 });
  });

  test('ADMIN → /admin está permitido', async ({ page }) => {
    await injectAuth(page, adminToken);
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin', { timeout: 15000 });
  });

  test('ADMIN → /dashboard está permitido', async ({ page }) => {
    await injectAuth(page, adminToken);
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
  });
});
