import { test, expect, type Locator } from '@playwright/test';
import { apiRegisterAndLogin, apiLogin } from './helpers/api';
import { injectAuth } from './helpers/auth';

// Click "crudo" vía element.click() en el DOM, saltando el motor de
// actionability/retry de Playwright. Necesario para los botones "Siguiente"/
// "Atrás" del wizard: en el límite Trayectoria -> Revisión el botón en esa
// misma posición de pantalla pasa de data-testid="profile-wizard-next" a
// "profile-wizard-submit", y locator.click() puede quedarse reintentando
// contra un elemento que React ya desmontó a mitad del click (gotcha
// documentado durante WU2/WU3 para este mismo botón).
async function rawClick(locator: Locator) {
  await locator.evaluate((el) => (el as HTMLElement).click());
}

// E2E adicional para el wizard de onboarding de perfil (profile-wizard SDD,
// WU4/PR4). Spec nuevo y aditivo: NO modifica e2e/profile.spec.ts ni ningún
// otro spec existente (R8/R9).
//
// Cada test de Playwright corre en un browser context nuevo (sin
// storageState configurado en playwright.config.ts), así que localStorage
// arranca vacío en cada test: el marcador de onboarding
// (`incubadora:onboarding:profile-wizard:${username}`) nunca existe al
// empezar un test, sin importar qué usuario se use. Por eso cada escenario
// usa su propio usuario registrado vía API (evita interferencia entre tests
// que corren en paralelo con otros spec files).

const PREFIX = 'pwiz';
// Sufijo único por ejecución: sin esto, re-correr la suite reutiliza el
// mismo usuario (via el fallback apiLogin de más abajo) y el wizard arranca
// con datos ya guardados por una corrida anterior (ej. un idioma ya
// existente), rompiendo los tests que asumen un perfil recién creado.
const RUN_ID = Date.now().toString().slice(-8);

function buildUser(suffix: string) {
  return {
    username: `${PREFIX}_${suffix}_${RUN_ID}`,
    email: `${PREFIX}_${suffix}_${RUN_ID}@e2e.test`,
    password: 'Password123!',
    firstName: 'Wizard',
    lastName: 'Tester',
  };
}

const USERS = {
  banner: buildUser('banner'),
  dismiss: buildUser('dismiss'),
  skip: buildUser('skip'),
  full: buildUser('full'),
};

const tokens: Record<keyof typeof USERS, string> = {} as Record<
  keyof typeof USERS,
  string
>;

test.describe('Wizard de onboarding de perfil', () => {
  test.beforeAll(async ({ request }) => {
    for (const key of Object.keys(USERS) as (keyof typeof USERS)[]) {
      const user = USERS[key];
      tokens[key] = await apiRegisterAndLogin(request, user).catch(() =>
        apiLogin(request, { username: user.username, password: user.password })
      );
    }
  });

  test('muestra el banner a un usuario nuevo y la acción primaria abre el wizard', async ({
    page,
  }) => {
    await injectAuth(page, tokens.banner);
    await page.goto('/dashboard');
    await page.waitForURL('/dashboard', { timeout: 15000 });

    const banner = page.getByTestId('profile-completion-banner');
    await expect(banner).toBeVisible({ timeout: 10000 });

    await banner.getByTestId('profile-completion-banner-primary').click();
    await page.waitForURL('/complete-profile', { timeout: 15000 });
    await expect(
      page.getByTestId('profile-wizard-step-basics')
    ).toBeVisible({ timeout: 10000 });
  });

  test('omitir descarta el banner sin enviar PUT y persiste tras recargar', async ({
    page,
  }) => {
    await injectAuth(page, tokens.dismiss);
    await page.goto('/dashboard');
    await page.waitForURL('/dashboard', { timeout: 15000 });

    const banner = page.getByTestId('profile-completion-banner');
    await expect(banner).toBeVisible({ timeout: 10000 });

    let putSent = false;
    page.on('request', (req) => {
      if (req.method() === 'PUT' && req.url().endsWith('/api/profile')) {
        putSent = true;
      }
    });

    await banner.getByTestId('profile-completion-banner-dismiss').click();
    await expect(banner).toBeHidden({ timeout: 10000 });
    expect(putSent).toBe(false);

    // La ausencia del banner debe persistir (marcador en localStorage), no
    // ser solo un estado en memoria del componente.
    await page.reload();
    await expect(
      page.getByTestId('profile-completion-banner')
    ).toBeHidden({ timeout: 10000 });
  });

  test('omitir desde un paso avanzado del wizard no persiste nada y oculta el banner', async ({
    page,
  }) => {
    await injectAuth(page, tokens.skip);
    await page.goto('/dashboard');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.getByTestId('profile-completion-banner-primary').click();
    await page.waitForURL('/complete-profile', { timeout: 15000 });

    let putSent = false;
    page.on('request', (req) => {
      if (req.method() === 'PUT' && req.url().endsWith('/api/profile')) {
        putSent = true;
      }
    });

    // Se tipea contenido sin guardar en el primer paso y se avanza uno más,
    // para omitir con input real "en vuelo" (R4: omitir es válido en
    // cualquier paso, no solo en el primero).
    await page.getByLabel('Titular Profesional').fill('No debería guardarse');
    await rawClick(page.getByTestId('profile-wizard-next'));
    await expect(
      page.getByTestId('profile-wizard-step-stack')
    ).toBeVisible({ timeout: 10000 });

    await page.getByTestId('profile-wizard-skip').click();
    await page.waitForURL('/dashboard', { timeout: 15000 });

    expect(putSent).toBe(false);
    await expect(
      page.getByTestId('profile-completion-banner')
    ).toBeHidden({ timeout: 10000 });

    await page.reload();
    await expect(
      page.getByTestId('profile-completion-banner')
    ).toBeHidden({ timeout: 10000 });
  });

  test('completar los 4 pasos valida por paso, preserva el input al navegar y guarda una sola vez', async ({
    page,
  }) => {
    await injectAuth(page, tokens.full);
    await page.goto('/dashboard');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    await page.getByTestId('profile-completion-banner-primary').click();
    await page.waitForURL('/complete-profile', { timeout: 15000 });

    let putCount = 0;
    page.on('request', (req) => {
      if (req.method() === 'PUT' && req.url().endsWith('/api/profile')) {
        putCount += 1;
      }
    });

    const headline = 'Fullstack Developer | Wizard E2E';
    const bio = 'Bio completa a través del wizard de onboarding E2E.';
    const socialUrl = 'https://linkedin.com/in/e2e-wizard-tester';

    // ---- Paso 1: Básicos ----
    await expect(
      page.getByTestId('profile-wizard-step-basics')
    ).toBeVisible({ timeout: 10000 });
    await page.getByLabel('Titular Profesional').fill(headline);
    await page.getByLabel('Biografía').fill(bio);
    await rawClick(page.getByTestId('profile-wizard-next'));

    // ---- Paso 2: Stack ----
    await expect(
      page.getByTestId('profile-wizard-step-stack')
    ).toBeVisible({ timeout: 10000 });
    await page.getByText('+ Añadir Idioma').click();
    await page.getByPlaceholder('Idioma').fill('Inglés');
    await page.locator('select').selectOption('Avanzado');
    await rawClick(page.getByTestId('profile-wizard-next'));

    // ---- Paso 3: Trayectoria ----
    await expect(
      page.getByTestId('profile-wizard-step-trajectory')
    ).toBeVisible({ timeout: 10000 });
    await page.getByText('+ Añadir Red Social').click();
    await page
      .getByPlaceholder('Plataforma (ej: LinkedIn, Twitter)')
      .fill('LinkedIn');
    await page.getByPlaceholder('https://...').fill('not-a-valid-url');

    // R2: un paso inválido bloquea el avance (única regla de validación real
    // del wizard: el patrón de URL en socialLinks[].url).
    await rawClick(page.getByTestId('profile-wizard-next'));
    await expect(
      page.getByText(/debe contener el protocolo/i)
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByTestId('profile-wizard-step-trajectory')
    ).toBeVisible();

    await page.getByPlaceholder('https://...').fill(socialUrl);
    await rawClick(page.getByTestId('profile-wizard-next'));

    // ---- Paso 4: Revisión (muestra los valores ya cargados) ----
    await expect(
      page.getByTestId('profile-wizard-step-review')
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(headline)).toBeVisible();
    await expect(page.getByText(bio)).toBeVisible();

    // R3: navegar hacia atrás por los 3 pasos previos no debe perder nada de
    // lo tipeado.
    await rawClick(page.getByTestId('profile-wizard-back'));
    await expect(
      page.getByTestId('profile-wizard-step-trajectory')
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('https://...')).toHaveValue(socialUrl);

    await rawClick(page.getByTestId('profile-wizard-back'));
    await expect(
      page.getByTestId('profile-wizard-step-stack')
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('Idioma')).toHaveValue('Inglés');

    await rawClick(page.getByTestId('profile-wizard-back'));
    await expect(
      page.getByTestId('profile-wizard-step-basics')
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel('Titular Profesional')).toHaveValue(headline);
    await expect(page.getByLabel('Biografía')).toHaveValue(bio);

    // Y avanzar de nuevo hasta revisión confirma que nada se perdió en el
    // viaje de ida y vuelta.
    await rawClick(page.getByTestId('profile-wizard-next'));
    await expect(
      page.getByTestId('profile-wizard-step-stack')
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('Idioma')).toHaveValue('Inglés');

    await rawClick(page.getByTestId('profile-wizard-next'));
    await expect(
      page.getByTestId('profile-wizard-step-trajectory')
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('https://...')).toHaveValue(socialUrl);

    await rawClick(page.getByTestId('profile-wizard-next'));
    await expect(
      page.getByTestId('profile-wizard-step-review')
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(headline)).toBeVisible();

    // ---- Guardar (R5: un único PUT) ----
    const submitBtn = page.getByTestId('profile-wizard-submit');
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
    await rawClick(submitBtn);

    await page.waitForURL('/dashboard', { timeout: 15000 });
    expect(putCount).toBe(1);
    await expect(page.getByText('Perfil actualizado')).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByTestId('profile-completion-banner')
    ).toBeHidden({ timeout: 10000 });

    // ---- R7: la data guardada se refleja sin recargar la página ----
    // Navegación 100% cliente (dropdown del Navbar, contrato E2E
    // data-testid="user-menu-trigger" + link "Mi Perfil"), sin page.goto():
    // ejercita la invalidación real de ["userProfile"] (D2, primer
    // setQueryData del onSuccess), no un fetch fresco de una SPA reiniciada.
    await page.getByTestId('user-menu-trigger').click();
    await page.getByRole('link', { name: 'Mi Perfil' }).click();
    await expect(page).toHaveURL('/profile');
    await expect(page.getByText(headline)).toBeVisible({ timeout: 10000 });

    // Vuelta al dashboard, también por navegación cliente. DeveloperDashboard
    // no renderiza ningún campo editable por el wizard (headline/bio/stack/
    // trayectoria/redes no aparecen en su UI), así que no hay un valor
    // visible para verificar el segundo setQueryData(["userData"]) del D2
    // más allá de esta comprobación de no-regresión: la página carga bien y
    // el banner se mantiene oculto. La escritura de ["userData"] en sí (T2.8)
    // ya fue verificada por revisión de código y por el smoke de WU2.
    await page.getByTestId('user-menu-trigger').click();
    await page.getByRole('link', { name: 'Panel' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByTestId('profile-completion-banner')
    ).toBeHidden({ timeout: 10000 });
  });
});
