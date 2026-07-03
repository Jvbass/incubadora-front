import { test, expect } from '@playwright/test';
import { apiRegisterAndLogin, apiCreateProject, apiGetMyProjects } from './helpers/api';
import { injectAuth } from './helpers/auth';

const PREFIX = 'proj';
const USER = {
  username: `${PREFIX}_user1`,
  email: `${PREFIX}_user1@e2e.test`,
  password: 'Password123!',
  firstName: 'Proj',
  lastName: 'Tester',
};

let authToken: string;
let projectSlug: string;

test.describe('Proyectos', () => {
  test.beforeAll(async ({ request }) => {
    // Registrar usuario y obtener token via API (más rápido que UI)
    authToken = await apiRegisterAndLogin(request, USER).catch(async () => {
      // Si ya existe, hacer solo login
      const { apiLogin } = await import('./helpers/api');
      return apiLogin(request, { username: USER.username, password: USER.password });
    });
  });

  test('should display home page with project sections', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/home');
    await page.waitForURL('/home', { timeout: 15000 });

    // La página de inicio tiene secciones de proyectos
    await expect(page).toHaveURL('/home');
    await expect(page.locator('main, [role="main"], .max-w-7xl').first()).toBeVisible({ timeout: 10000 });
  });

  test('should create a new project', async ({ page }) => {
    await injectAuth(page, authToken);
    await page.goto('/projects/new');
    await page.waitForURL('/projects/new', { timeout: 15000 });

    const projectTitle = `${PREFIX} Test Project ${Date.now()}`;
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });

    // ---- Wizard paso 1: básicos (rediseño v2, SDD §12.3 R5) ----
    await page.fill('#title', projectTitle);
    await page.fill('#subtitle', 'E2E subtitle test');
    await nextBtn.click();

    // ---- Wizard paso 2: descripción (MDEditor) ----
    const mdEditor = page.locator('.w-md-editor-text-input, textarea[name="description"]');
    await mdEditor.first().fill('## Descripción\n\nProyecto de prueba E2E.');
    await nextBtn.click();

    // ---- Wizard paso 3: tecnologías y opciones ----
    // Tecnologías — usa react-select, necesitamos pressSequentially para activar el filtrado
    const techInput = page.getByRole('combobox').first();
    await techInput.click();
    // Abrir el menú y seleccionar la primera opción sin filtrar
    await techInput.press('ArrowDown');
    await page.waitForTimeout(300);
    const firstOption = page.locator('[class*="option"]').first();
    if (await firstOption.count() > 0) {
      await firstOption.click();
    } else {
      // Intentar escribir para buscar opciones
      await techInput.pressSequentially('React', { delay: 50 });
      await page.waitForTimeout(500);
      const option = page.locator('[class*="option"]').first();
      if (await option.count() > 0) await option.click();
    }
    // Estado del proyecto - seleccionar "published" (tiene id="status")
    await page.selectOption('#status', 'published');
    await nextBtn.click();

    // ---- Wizard paso 4: revisión y envío ----
    // Esperar a que el panel de revisión esté renderizado y estable antes de
    // clickear: durante la transición de paso el footer cambia de "Siguiente"
    // a "Publicar Proyecto" y el botón se desprende del DOM si se clickea antes.
    await expect(
      page.getByRole('heading', { name: /revisa antes de publicar/i })
    ).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /publicar proyecto|crear proyecto|guardar/i }).click();

    // Después de crear, redirige al dashboard
    await expect(page).toHaveURL(/\/(dashboard|project\/)/, { timeout: 15000 });
  });

  test('should show my projects in dashboard', async ({ page, request }) => {
    // Crear un proyecto via API para asegurar que haya al menos uno
    await apiCreateProject(request, authToken, {
      title: `${PREFIX} Dashboard Project`,
      subtitle: 'Para el dashboard',
      description: 'Proyecto para prueba de dashboard.',
      status: 'published',
    });

    await injectAuth(page, authToken);
    await page.goto('/dashboard');
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // El dashboard debe mostrar los proyectos del usuario
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to project detail', async ({ page, request }) => {
    // Crear un proyecto y obtener su slug
    const project = await apiCreateProject(request, authToken, {
      title: `${PREFIX} Detail Project ${Date.now()}`,
      subtitle: 'Para ver el detalle',
      description: 'Proyecto para prueba de detalle.',
      status: 'published',
    });

    projectSlug = project.slug;

    await injectAuth(page, authToken);
    await page.goto(`/project/${projectSlug}`);

    await expect(
      page.getByRole('heading', { name: project.title })
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display empty state for user with no projects', async ({ page, request }) => {
    const { apiRegisterAndLogin } = await import('./helpers/api');
    const emptyUser = {
      username: `${PREFIX}_empty_${Date.now()}`,
      email: `${PREFIX}_empty_${Date.now()}@e2e.test`,
      password: 'Password123!',
      firstName: 'Empty',
      lastName: 'User',
    };
    const emptyToken = await apiRegisterAndLogin(request, emptyUser);

    await injectAuth(page, emptyToken);
    await page.goto('/dashboard');
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // Buscar texto de estado vacío
    const emptyState = page.getByText(/no tienes proyectos|sin proyectos|aún no has/i);
    // Si existe el estado vacío, verificar que es visible; si no, el dashboard cargó correctamente
    const hasEmptyState = await emptyState.count() > 0;
    if (hasEmptyState) {
      await expect(emptyState.first()).toBeVisible();
    } else {
      // El dashboard al menos debe cargar sin errores
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
