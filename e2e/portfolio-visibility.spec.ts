import { test, expect, type APIRequestContext } from '@playwright/test';
import { apiLogin, apiRegisterAndLogin } from './helpers/api';
import { injectAuth } from './helpers/auth';
import { BASE_API_URL } from './helpers/constants';

/**
 * Matriz de acceso por visibilidad de perfil (portfolio-visibility, P2).
 *
 * Cubre las 7 combinaciones mínimas exigidas por la spec (NFR "E2E coverage
 * per boundary") más la visibilidad de las advertencias del selector en
 * /settings. Toda denegación (perfil inexistente o modo no visible para el
 * requester) es 404 uniforme — ver PortfolioPage.tsx.
 *
 * Cuentas seed reutilizadas de otras suites (ver authorization.spec.ts):
 *   admin       / Admin123!  → ADMINISTRATOR
 *   steve-wozniak / Dev123!  → RECRUITER
 */

const PREFIX = 'pv';

const OWNER = {
  username: `${PREFIX}_owner`,
  email: `${PREFIX}_owner@e2e.test`,
  password: 'Password123!',
  firstName: 'Visibility',
  lastName: 'Owner',
};

const OTHER_DEV = {
  username: `${PREFIX}_other_dev`,
  email: `${PREFIX}_other_dev@e2e.test`,
  password: 'Password123!',
  firstName: 'Other',
  lastName: 'Dev',
};

const NOT_AVAILABLE_TESTID = '[data-testid="portfolio-not-available"]';

let ownerToken: string;
let ownerSlug: string;
let otherDevToken: string;
let recruiterToken: string;
let adminToken: string;

/**
 * Cambia el modo de visibilidad del perfil del owner via API, preservando
 * el resto de los campos (el backend reemplaza el perfil entero en el PUT).
 */
async function setOwnerVisibility(
  request: APIRequestContext,
  visibility: 'PUBLIC' | 'INCUBADORA' | 'APPLICANT' | 'PRIVATE'
) {
  const profileRes = await request.get(`${BASE_API_URL}/profile`, {
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  const profile = await profileRes.json();

  const response = await request.put(`${BASE_API_URL}/profile`, {
    data: {
      headline: profile.headline ?? '',
      slug: profile.slug,
      bio: profile.bio ?? '',
      profileVisibility: visibility,
      socialLinks: (profile.socialLinks ?? []).map(
        ({ platform, url }: { platform: string; url: string }) => ({ platform, url })
      ),
      techStackIds: (profile.techStack ?? []).map((t: { id: number }) => t.id),
      workExperiences: (profile.workExperiences ?? []).map(
        (exp: {
          companyName: string;
          position: string;
          description: string;
          startYear: number;
          endYear?: number;
        }) => ({
          companyName: exp.companyName,
          position: exp.position,
          description: exp.description,
          startYear: exp.startYear,
          endYear: exp.endYear,
        })
      ),
      languages: (profile.languages ?? []).map(
        (l: { language: string; proficiency: string }) => ({
          language: l.language,
          proficiency: l.proficiency,
        })
      ),
      certificates: (profile.certificates ?? []).map(
        (c: { name: string; imageUrl: string; certificateUrl: string }) => ({
          name: c.name,
          imageUrl: c.imageUrl,
          certificateUrl: c.certificateUrl,
        })
      ),
    },
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`setOwnerVisibility(${visibility}) failed (${response.status()}): ${body}`);
  }
}

/** Espera a que el spinner de carga desaparezca antes de inspeccionar el body. */
async function waitForPortfolioSettled(page: import('@playwright/test').Page) {
  await page
    .waitForFunction(
      () => !document.body.innerText.toLowerCase().includes('cargando'),
      { timeout: 20000 }
    )
    .catch(() => {});
}

test.describe('Matriz de visibilidad de portafolio', () => {
  test.beforeAll(async ({ request }) => {
    ownerToken = await apiRegisterAndLogin(request, OWNER).catch(async () =>
      apiLogin(request, { username: OWNER.username, password: OWNER.password })
    );
    otherDevToken = await apiRegisterAndLogin(request, OTHER_DEV).catch(async () =>
      apiLogin(request, { username: OTHER_DEV.username, password: OTHER_DEV.password })
    );
    recruiterToken = await apiLogin(request, { username: 'steve-wozniak', password: 'Dev123!' });
    adminToken = await apiLogin(request, { username: 'admin', password: 'Admin123!' });

    const profileRes = await request.get(`${BASE_API_URL}/profile`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const profile = await profileRes.json();
    ownerSlug = profile.slug;
  });

  test('PUBLIC: un visitante anónimo puede ver el portafolio', async ({ page, request }) => {
    await setOwnerVisibility(request, 'PUBLIC');
    await page.goto(`/portfolio/${ownerSlug}`);
    await waitForPortfolioSettled(page);

    await expect(page.locator(NOT_AVAILABLE_TESTID)).toHaveCount(0);
    await expect(
      page.getByText(new RegExp(`${OWNER.firstName}|${OWNER.lastName}`, 'i')).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('INCUBADORA: un visitante anónimo es denegado (404 amable)', async ({ page, request }) => {
    await setOwnerVisibility(request, 'INCUBADORA');
    await page.goto(`/portfolio/${ownerSlug}`);
    await waitForPortfolioSettled(page);

    await expect(page.locator(NOT_AVAILABLE_TESTID)).toBeVisible({ timeout: 10000 });
  });

  test('INCUBADORA: un DEV no-owner logueado puede ver el portafolio', async ({ page, request }) => {
    await setOwnerVisibility(request, 'INCUBADORA');
    await injectAuth(page, otherDevToken);
    await page.goto(`/portfolio/${ownerSlug}`);
    await waitForPortfolioSettled(page);

    await expect(page.locator(NOT_AVAILABLE_TESTID)).toHaveCount(0);
    await expect(
      page.getByText(new RegExp(`${OWNER.firstName}|${OWNER.lastName}`, 'i')).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('APPLICANT: un DEV no-owner es denegado (404 amable)', async ({ page, request }) => {
    await setOwnerVisibility(request, 'APPLICANT');
    await injectAuth(page, otherDevToken);
    await page.goto(`/portfolio/${ownerSlug}`);
    await waitForPortfolioSettled(page);

    await expect(page.locator(NOT_AVAILABLE_TESTID)).toBeVisible({ timeout: 10000 });
  });

  test('APPLICANT: un RECRUITER puede ver el portafolio', async ({ page, request }) => {
    await setOwnerVisibility(request, 'APPLICANT');
    await injectAuth(page, recruiterToken);
    await page.goto(`/portfolio/${ownerSlug}`);
    await waitForPortfolioSettled(page);

    await expect(page.locator(NOT_AVAILABLE_TESTID)).toHaveCount(0);
    await expect(
      page.getByText(new RegExp(`${OWNER.firstName}|${OWNER.lastName}`, 'i')).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('PRIVATE: un RECRUITER es denegado (404 amable)', async ({ page, request }) => {
    await setOwnerVisibility(request, 'PRIVATE');
    await injectAuth(page, recruiterToken);
    await page.goto(`/portfolio/${ownerSlug}`);
    await waitForPortfolioSettled(page);

    await expect(page.locator(NOT_AVAILABLE_TESTID)).toBeVisible({ timeout: 10000 });
  });

  test('PRIVATE: el owner puede ver su propio portafolio', async ({ page, request }) => {
    await setOwnerVisibility(request, 'PRIVATE');
    await injectAuth(page, ownerToken);
    await page.goto(`/portfolio/${ownerSlug}`);
    await waitForPortfolioSettled(page);

    await expect(page.locator(NOT_AVAILABLE_TESTID)).toHaveCount(0);
    await expect(
      page.getByText(new RegExp(`${OWNER.firstName}|${OWNER.lastName}`, 'i')).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('ADMINISTRATOR: bypassa la denegación en todos los modos', async ({ page, request }) => {
    const modes = ['PUBLIC', 'INCUBADORA', 'APPLICANT', 'PRIVATE'] as const;
    for (const mode of modes) {
      await setOwnerVisibility(request, mode);
      await injectAuth(page, adminToken);
      await page.goto(`/portfolio/${ownerSlug}`);
      await waitForPortfolioSettled(page);

      await expect(page.locator(NOT_AVAILABLE_TESTID)).toHaveCount(0);
      await expect(
        page.getByText(new RegExp(`${OWNER.firstName}|${OWNER.lastName}`, 'i')).first()
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('/settings: muestra advertencia al elegir PUBLIC y al elegir PRIVATE', async ({ page }) => {
    await injectAuth(page, ownerToken);
    await page.goto('/settings');
    await page.waitForURL('/settings', { timeout: 15000 });

    const select = page.locator('#profileVisibility');
    await expect(select).toBeVisible({ timeout: 10000 });

    await select.selectOption('PUBLIC');
    await expect(page.getByTestId('visibility-public-warning')).toBeVisible();
    await expect(page.getByTestId('visibility-private-warning')).toHaveCount(0);

    await select.selectOption('PRIVATE');
    await expect(page.getByTestId('visibility-private-warning')).toBeVisible();
    await expect(page.getByTestId('visibility-public-warning')).toHaveCount(0);

    await select.selectOption('INCUBADORA');
    await expect(page.getByTestId('visibility-public-warning')).toHaveCount(0);
    await expect(page.getByTestId('visibility-private-warning')).toHaveCount(0);
  });
});
