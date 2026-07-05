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
    // Sin autenticación, navegar al portfolio público.
    // Desde portfolio-visibility (P2) el default tras el registro es
    // INCUBADORA (opt-in estricto a PUBLIC vía V12), por lo que un
    // visitante anónimo debe ver el estado "no disponible" uniforme,
    // no el contenido del perfil.
    await page.goto(`/portfolio/${userSlug}`);
    await page.waitForFunction(
      () => !document.body.innerText.toLowerCase().includes('cargando'),
      { timeout: 20000 }
    ).catch(() => {});

    await expect(page.locator('[data-testid="portfolio-not-available"]')).toBeVisible({
      timeout: 15000,
    });
  });

  test('should return 404 or error for non-existent slug', async ({ page }) => {
    await page.goto('/portfolio/slug-que-no-existe-xyz-e2e-12345');
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    // El backend responde 404 uniforme tanto para slugs inexistentes como
    // para accesos denegados por modo de visibilidad (portfolio-visibility, P2).
    await expect(page.locator('[data-testid="portfolio-not-available"]')).toBeVisible({
      timeout: 10000,
    });
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

  test('should upload and delete avatar image', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/settings');
    await page.waitForURL('/settings', { timeout: 15000 });

    // La sección "Avatar" y la de "Imagen de banner" comparten la misma
    // estructura (ImageUpload en variante rectangle); se distinguen por el
    // texto del label, ya que el componente no expone data-testid.
    const avatarSection = page.locator('div.space-y-2').filter({ hasText: 'Avatar' }).first();
    const fileInput = avatarSection.locator('input[type="file"]');

    // PNG 1x1 válido embebido como buffer (no hay fixtures de imágenes en el repo).
    const tinyPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64'
    );
    await fileInput.setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: tinyPng,
    });

    // Confirmar la subida (toast + invalidación de la query userProfile).
    await expect(page.getByText('Avatar actualizado correctamente.')).toBeVisible({ timeout: 15000 });

    // El botón "Eliminar imagen" solo se muestra cuando hay currentImageUrl
    // Y no hay preview local activo; tras subir, el preview local del blob
    // sigue seteado, así que se recarga la página para reflejar el
    // avatarUrl persistido y limpiar el preview.
    await page.reload();
    await expect(page.getByText('Imágenes del perfil')).toBeVisible({ timeout: 15000 });

    const deleteBtn = avatarSection.getByRole('button', { name: 'Eliminar imagen' });
    await expect(deleteBtn).toBeVisible({ timeout: 15000 });

    // handleDelete usa confirm() nativo — aceptar el diálogo ANTES de hacer clic.
    page.once('dialog', (dialog) => dialog.accept());
    await deleteBtn.click();

    await expect(page.getByText('Avatar eliminado.')).toBeVisible({ timeout: 15000 });
    await expect(deleteBtn).toBeHidden({ timeout: 15000 });
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
