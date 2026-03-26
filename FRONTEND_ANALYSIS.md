# FRONTEND_ANALYSIS.md — incubadora.dev

> Generado: 2026-03-16 | Branch: `feat/mentoring-page` | Stack: React 19 + TypeScript + Vite

---

## 1. ESTRUCTURA DE CARPETAS

### Organización: Por Tipo (no por feature)

```
src/
├── api/
│   ├── apiService.ts          ← Instancia Axios + interceptores
│   └── queries.ts             ← Todas las funciones de llamada a la API
├── components/
│   ├── button/
│   │   └── RoundedButton.tsx
│   ├── layout/
│   │   ├── AuthenticatedLayout.tsx
│   │   ├── BackgroundEffects.tsx
│   │   ├── MenuButton.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ThemeApplier.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── providers/
│   │   └── AuthProvider.tsx
│   ├── ui/
│   │   ├── card/
│   │   │   ├── CommentCard.tsx
│   │   │   ├── FeedbackCard.tsx
│   │   │   ├── Mentorshipcard.tsx
│   │   │   └── ProjectCard.tsx
│   │   ├── feedback-comment/
│   │   │   ├── CommentForm.tsx
│   │   │   ├── CommentNode.tsx
│   │   │   └── CommentThread.tsx
│   │   ├── feedback-form/
│   │   │   └── FeedbackForm.tsx
│   │   ├── mentorship/
│   │   │   └── MentorshipForm.tsx
│   │   ├── modal/
│   │   │   ├── GiveKudoModal.tsx
│   │   │   └── Modal.tsx
│   │   ├── notification/
│   │   │   ├── NotificationDropdown.tsx
│   │   │   └── NotificationItem.tsx
│   │   ├── project-detail/
│   │   │   ├── ProjectMainContent.tsx
│   │   │   └── ProjectSidePanel.tsx
│   │   ├── project-form/
│   │   │   ├── FormSidePanel.tsx
│   │   │   ├── MultiSelect.tsx
│   │   │   └── ProjectForm.tsx
│   │   └── project-home/
│   │       ├── ProjectHomeSide.tsx
│   │       └── ProjectList.tsx
│   └── ux/
│       ├── Loading.tsx
│       ├── RocketSlider.tsx
│       └── StarRating.tsx
├── data/
│   └── formHelpContent.ts
├── hooks/
│   ├── useActiveField.ts
│   ├── useAuthZustand.tsx
│   ├── useEffectiveTheme.ts
│   └── useProjectRating.ts
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   ├── AdminDashboard.tsx
│   │   ├── CreateMentorshipPage.tsx
│   │   ├── CreateProjectPage.tsx
│   │   ├── DeveloperDashboard.tsx
│   │   └── MentorDashboard.tsx
│   ├── profile/
│   │   ├── EditProfilePage.tsx
│   │   └── ProfilePage.tsx
│   ├── HomePage.tsx
│   ├── NotFound.tsx
│   └── ProjectDetailPage.tsx
├── router/
│   ├── index.tsx
│   ├── ProtectedRoute.tsx
│   ├── PublicRoute.tsx
│   └── RoleBasedRedirect.tsx
├── stores/
│   ├── authStore.ts
│   └── themeStore.ts
├── types/
│   └── index.ts
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

**Observación:** La estructura es **por tipo** (components, pages, hooks, api, stores), con cierta organización por dominio dentro de `components/ui/` (feedback-comment, project-form, etc.). No existe una carpeta `features/` ni módulos auto-contenidos.

---

## 2. DEPENDENCIAS (`package.json`)

### Runtime

| Paquete | Versión | Uso |
|---|---|---|
| `react` | 19.2.3 | Core |
| `react-dom` | 19.2.3 | Core |
| `react-router-dom` | 7.6.2 | Routing |
| `@tanstack/react-query` | 5.81.2 | Server state |
| `axios` | 1.10.0 | HTTP client |
| `zustand` | 5.0.6 | Estado global (auth, theme) |
| `react-hook-form` | 7.58.1 | Formularios |
| `tailwindcss` | 4.1.10 | Estilos |
| `@tailwindcss/vite` | 4.1.10 | Plugin Vite para Tailwind |
| `lucide-react` | 0.525.0 | Íconos |
| `react-hot-toast` | 2.5.2 | Notificaciones |
| `jwt-decode` | 4.0.0 | Parseo de tokens JWT |
| `@uiw/react-md-editor` | 4.0.8 | Editor Markdown |
| `react-md-editor` | 0.2.2 | ⚠️ Duplicado — versión vieja del mismo editor |
| `react-select` | 5.10.1 | Select multi-opción |
| `dompurify` | 3.2.6 | Sanitización HTML |
| `rehype-sanitize` | 6.0.0 | Sanitización para rehype |
| `@headlessui/react` | 0.0.0-insiders | Componentes UI sin estilos |

### DevDependencies

| Paquete | Versión | Uso |
|---|---|---|
| `vite` | 6.3.5 | Build tool |
| `@vitejs/plugin-react` | 4.4.1 | Plugin React para Vite |
| `typescript` | ~5.8.3 | TypeScript |
| `typescript-eslint` | 8.30.1 | Linting TS |
| `eslint` | 9.25.0 | Linting |
| `@tanstack/react-query-devtools` | 5.81.2 | DevTools React Query |
| `@tailwindcss/typography` | 0.5.16 | Plugin tipografía Tailwind |
| `@types/react` | 19.1.2 | Tipos React |
| `@types/react-dom` | 19.1.2 | Tipos React DOM |
| `@types/dompurify` | 3.0.5 | Tipos DOMPurify |
| `@types/react-select` | 5.0.0 | Tipos React Select |

> ⚠️ **`react-md-editor` (0.2.2)** y **`@uiw/react-md-editor` (4.0.8)** son el mismo paquete en distintas versiones. Debería eliminarse `react-md-editor`.

---

## 3. PÁGINAS Y RUTAS

### Rutas Actuales (definidas en `src/router/index.tsx`)

| Path | Componente | Protegida | Rol requerido |
|---|---|---|---|
| `/` | `RoleBasedRedirect` | Sí | Cualquier autenticado |
| `/login` | `LoginPage` | No (PublicRoute) | — |
| `/register` | `RegisterPage` | No (PublicRoute) | — |
| `/home` | `HomePage` | Sí | DEV (redirect desde `/`) |
| `/dashboard` | `DeveloperDashboard` / `MentorDashboard` | Sí | DEV / MENTOR |
| `/admin` | `AdminDashboard` | Sí | ADMINISTRATOR |
| `/profile` | `ProfilePage` | Sí | Cualquier autenticado |
| `/profile/:slug` | `ProfilePage` | Sí | Cualquier autenticado |
| `/profile/edit` | `EditProfilePage` | Sí | Cualquier autenticado |
| `/create-project` | `CreateProjectPage` | Sí | Cualquier autenticado |
| `/project/:projectSlug` | `ProjectDetailPage` | Sí | Cualquier autenticado |
| `/create-mentorship` | `CreateMentorshipPage` | Sí | Cualquier autenticado |
| `*` | `NotFound` | No | — |

### Comparación contra las 14 Rutas del DDD

| Ruta DDD | Estado | Ruta actual / Nota |
|---|---|---|
| `/login` | ✅ Existe | `/login` |
| `/register` | ✅ Existe | `/register` |
| `/` | ✅ Existe | `/` → `RoleBasedRedirect` (redirige según rol) |
| `/portfolio/:slug` | ❌ Falta | Implementado como `/profile/:slug` — nombre diferente al DDD |
| `/proyect/:slug` | ⚠️ Parcial | Existe como `/project/:projectSlug` — ruta pública no implementada (actualmente protegida) |
| `/projects/new` | ⚠️ Parcial | Existe como `/create-project` — path diferente al DDD |
| `/projects/:slug/edit` | ❌ Falta | No existe ruta dedicada; la edición se hace en modal dentro del dashboard |
| `/mentoring` | ❌ Falta | No existe ruta de listado público de mentorías |
| `/mentoring/:slug` | ❌ Falta | No existe vista detalle de mentoría |
| `/mentoring/new` | ⚠️ Parcial | Existe como `/create-mentorship` — path diferente al DDD |
| `/mentoring/:slug/edit` | ❌ Falta | No existe ruta de edición de mentoría; se hace en modal |
| `/dashboard` | ✅ Existe | `/dashboard` → muestra `DeveloperDashboard` o `MentorDashboard` según rol |
| `/settings` | ❌ Falta | No existe; `/profile/edit` cubre parcialmente esta función |
| `/admin` | ✅ Existe | `/admin` → `AdminDashboard` |

**Resumen rutas:** 5 rutas coinciden ✅ | 3 parciales ⚠️ | 6 faltan ❌

> **Nota crítica:** Las rutas del DDD sugieren que `/proyect/:slug`, `/mentoring`, `/portfolio/:slug` deben ser **públicas** (accesibles sin login). Actualmente todas las rutas excepto `/login` y `/register` están protegidas.

---

## 4. API CALLS

### Instancia Centralizada

**Sí.** `src/api/apiService.ts` define una instancia Axios con:
- **Base URL:** `http://localhost:8080/api`
- **Content-Type:** `application/json`

### Interceptores

| Interceptor | Función |
|---|---|
| **Request** | Adjunta el JWT de localStorage como `Authorization: Bearer {token}` |
| **Response (401)** | Limpia el token, llama a logout del authStore, redirige a `/login` |
| **Response (403)** | Verifica si es error de auth, redirige si corresponde |
| **Response (errores)** | Muestra toast con mensaje de error |

### Endpoints Mapeados (`src/api/queries.ts`)

**Auth**
| Función | Método | Endpoint |
|---|---|---|
| `loginUser` | POST | `/auth/login` |
| `registerUser` | POST | `/auth/register` |
| `fetchUserData` | GET | `/auth/me` |

**Profile**
| Función | Método | Endpoint |
|---|---|---|
| `fetchUserProfile` | GET | `/profile/me` |
| `updateUserProfile` | PUT | `/profile/me` |
| `fetchPublicProfileBySlug` | GET | `/profile/{slug}` |

**Projects**
| Función | Método | Endpoint |
|---|---|---|
| `fetchProjects` | GET | `/projects?page=N&size=4&sortBy=X` |
| `createProject` | POST | `/projects` |
| `fetchTechnologies` | GET | `/technologies` |
| `fetchMyProjects` | GET | `/projects/my-projects` |
| `fetchProjectById` | GET | `/projects/{slug}` |
| `updateProjectById` | PUT | `/projects/{slug}` |

**Feedback**
| Función | Método | Endpoint |
|---|---|---|
| `fetchFeedbackForProject` | GET | `/projects/{slug}/feedback` |
| `createFeedbackForProject` | POST | `/projects/{slug}/feedback` |
| `updateFeedback` | PUT | `/feedback/{id}` |
| `deleteFeedback` | DELETE | `/feedback/{id}` |

**Comments**
| Función | Método | Endpoint |
|---|---|---|
| `fetchCommentsForFeedback` | GET | `/feedback/{id}/comments` |
| `createComment` | POST | `/feedback/{id}/comments` |
| `updateComment` | PUT | `/comments/{id}` |
| `deleteComment` | DELETE | `/comments/{id}` |

**Kudos**
| Función | Método | Endpoint |
|---|---|---|
| `postKudo` | POST | `/kudos` |

**Notifications**
| Función | Método | Endpoint |
|---|---|---|
| `fetchNotifications` | GET | `/notifications` |
| `markNotificationAsRead` | PUT | `/notifications/{id}/read` |
| `markAllNotificationsAsRead` | PUT | `/notifications/read-all` |

**Mentors (Admin)**
| Función | Método | Endpoint |
|---|---|---|
| `requestMentorUpgrade` | POST | `/mentor-requests` |
| `fetchMentorRequests` | GET | `/mentor-requests` |
| `approveMentorUpgrade` | POST | `/mentor-requests/{userId}/approve` |
| `rejectMentorUpgrade` | POST | `/mentor-requests/{id}/reject` |

**Mentorship**
| Función | Método | Endpoint |
|---|---|---|
| `createMentorship` | POST | `/mentorships` |
| `fetchMyMentorships` | GET | `/mentorships/my-mentorships` |
| `fetchMentorshipById` | GET | `/mentorships/{id}` |
| `updateMentorshipById` | PUT | `/mentorships/{id}` |
| `deleteMentorship` | DELETE | `/mentorships/{id}` |
| `updateMentorshipStatus` | PUT | `/mentorships/{id}/status` |

> ⚠️ **Falta:** Endpoint para listar mentorías públicas (para la ruta `/mentoring` del DDD).
> ⚠️ **Falta:** Endpoint de booking/solicitud de sesión de mentoría.

---

## 5. ESTADO GLOBAL

### Herramientas utilizadas

| Herramienta | Uso |
|---|---|
| **Zustand** | Estado global persistido (auth, theme) |
| **React Query** | Estado del servidor (proyectos, feedback, mentorías, etc.) |
| **React Hook Form** | Estado de formularios |
| **useState local** | Estado UI efímero (modales abiertos, etc.) |

### Stores de Zustand

#### `authStore.ts`
```typescript
interface AuthState {
  token: string | null
  user: User | null           // { username, role }
  isAuthenticated: boolean
  isLoading: boolean
  login(token: string): void  // Decodifica el JWT y setea user
  logout(): void              // Limpia token y user
  initializeAuth(): void      // Lee localStorage al arrancar
  setLoading(loading: boolean): void
}
```
- Persistido en `localStorage` (key `auth-storage`)
- Decodifica el JWT para obtener `username` y `role`
- Verifica expiración del token en `initializeAuth`

#### `themeStore.ts`
```typescript
type Theme = "light" | "dark" | "system"
interface ThemeState {
  theme: Theme
  setTheme(theme: Theme): void
}
```
- Persistido en `localStorage`
- `useEffectiveTheme` hook resuelve `"system"` al valor real según `prefers-color-scheme`

### Contexto (Providers)

#### `AuthProvider.tsx`
- Llama a `initializeAuth()` al montar la app
- Recupera el token de localStorage antes del primer render
- No expone estado propio (usa el store de Zustand directamente)

---

## 6. REACT QUERY

**Sí**, se usa `@tanstack/react-query` v5.81.2.

### Configuración global (`main.tsx`)
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15,  // 15 minutos
    },
  },
})
```

### Hooks de Query (useQuery)

| Query Key | Datos que carga | Dónde se usa |
|---|---|---|
| `["projects", sortBy, pageParam]` | Proyectos paginados (home) | `ProjectList.tsx` |
| `["my-projects"]` | Proyectos del usuario | `DeveloperDashboard`, `MentorDashboard` |
| `["project", projectSlug]` | Detalle de proyecto | `ProjectDetailPage` |
| `["technologies"]` | Lista de tecnologías | `ProjectForm` |
| `["feedback", projectSlug]` | Feedback de un proyecto | `ProjectDetailPage` |
| `["comments", feedbackId]` | Comentarios de un feedback | `FeedbackCard` |
| `["my-mentorships"]` | Mentorías del mentor | `MentorDashboard` |
| `["mentorship", id]` | Detalle de mentoría | `MentorDashboard` (modal edit) |
| `["notifications"]` | Notificaciones | `NotificationBell` (polling 10min) |
| `["profile"]` / `["profile", slug]` | Perfil público/privado | `ProfilePage` |
| `["mentor-requests"]` | Solicitudes de mentor | `AdminDashboard` |

### Hooks de Mutation (useMutation)

| Operación | Función API | Invalida queryKey |
|---|---|---|
| Login | `loginUser` | — |
| Register | `registerUser` | — |
| Crear proyecto | `createProject` | `["my-projects"]` |
| Actualizar proyecto | `updateProjectById` | `["my-projects"]`, `["project", slug]` |
| Crear feedback | `createFeedbackForProject` | `["feedback", slug]` |
| Actualizar feedback | `updateFeedback` | `["feedback", slug]` |
| Eliminar feedback | `deleteFeedback` | `["feedback", slug]` |
| Crear comentario | `createComment` | `["comments", feedbackId]` |
| Actualizar comentario | `updateComment` | `["comments", feedbackId]` |
| Eliminar comentario | `deleteComment` | `["comments", feedbackId]` |
| Dar kudo | `postKudo` | `["profile"]` |
| Crear mentoría | `createMentorship` | `["my-mentorships"]` |
| Actualizar mentoría | `updateMentorshipById` | `["my-mentorships"]`, `["mentorship", id]` |
| Eliminar mentoría | `deleteMentorship` | `["my-mentorships"]` |
| Cambiar status mentoría | `updateMentorshipStatus` | `["my-mentorships"]` |
| Solicitar upgrade a mentor | `requestMentorUpgrade` | — |
| Aprobar mentor | `approveMentorUpgrade` | `["mentor-requests"]` |
| Rechazar mentor | `rejectMentorUpgrade` | `["mentor-requests"]` |
| Marcar notificación leída | `markNotificationAsRead` | `["notifications"]` |
| Marcar todas leídas | `markAllNotificationsAsRead` | `["notifications"]` |
| Actualizar perfil | `updateUserProfile` | `["profile"]` |

**¿Query keys consistentes?** Mayormente sí. Usan arrays descriptivos. No hay una capa de `queryKeys.ts` centralizada (aunque sería recomendable).

---

## 7. TIPOS TYPESCRIPT

**Centralización:** ✅ Todos los tipos están en `src/types/index.ts`.

### Interfaces Definidas

**Auth & Usuario**
```typescript
DecodedToken      { sub, role, iat, exp }
User              { username, role }
RegisterRequest   { username, email, password, firstName, lastName }
LoginRequest      { username, password }
UserResponse      { username, email, firstName, lastName, role, slug }
```

**Perfil**
```typescript
ProfileResponse       { slug, firstName, lastName, headline, bio, email,
                        publicProfile, techStack[], socialLinks[],
                        workExperiences[], languages[], certificates[],
                        projects[], kudosReceived[], feedbackGiven[] }
ProfileUpdateRequest  { headline, slug, bio, publicProfile, ... }
WorkExperience        { companyName, position, startDate, endDate?, current, description }
SocialLink            { platform, url }
Certificate           { name, issuedBy, year, url? }
```

**Proyectos**
```typescript
Technology            { id, name, techColor }
ProjectSummary        { id, slug, title, subtitle, developerUsername,
                        createdAt, technologies[], isCollaborative,
                        needMentoring, status, developmentProgress,
                        feedbackCount, averageRating }
CreateProjectRequest  { title, subtitle, description, repositoryUrl,
                        projectUrl, technologyIds[], status,
                        isCollaborative, needMentoring, developmentProgress }
ProjectDetailResponse { ...ProjectSummary + description, developerSlug }
SortByType            "LATEST" | "MOST_FEEDBACK" | "TOP_RATED"
PagedResponse<T>      { content[], totalPages, totalElements, number, last }
```

**Feedback & Comentarios**
```typescript
CreateFeedbackRequest  { feedbackDescription, rating }
FeedbackResponse       { id, feedbackDescription, rating, author,
                         relatedProjectSlug, relatedProjectTitle,
                         authorId, projectId, createdAt, updatedAt? }
CreateCommentRequest   { content, parentCommentId? }
CommentResponse        { id, content, author: { username },
                         createdAt, replies[] }
```

**Kudos**
```typescript
KudoRequest   { recipientUsername, message, relatedProjectSlug? }
KudoResponse  { id, senderUsername, recipientUsername, message,
                relatedProjectSlug?, createdAt }
```

**Notificaciones**
```typescript
Notification  { id, message, read, type, createdAt,
                relatedEntityId?, relatedEntityType? }
```

**Mentores**
```typescript
MentorRequest  { id, requesterUsername, requesterSlug, requestDate,
                 status, notificationId }
```

**Mentorías**
```typescript
ScheduleSlotRequest       { dayOfWeek, startTime, endTime }
CreateMentorshipRequest   { title, description, specialty,
                            durationMinutes, platform, timezone,
                            price?, isFree, schedules[] }
MentorshipSummaryResponse { id, title, specialty, durationMinutes,
                            platform, price?, isFree, mentorUsername,
                            createdAt, status, totalBookings }
MentorshipDetailResponse  { ...summary + description, timezone,
                            schedules[], feedbackStats? }
```

---

## 8. COMPONENTES

### Layout (`src/components/layout/`)

| Componente | Descripción |
|---|---|
| `AuthenticatedLayout` | Wrapper principal: Navbar + Sidebar + contenido |
| `Navbar` | Barra superior: crear proyecto, notificaciones, tema, perfil, logout |
| `Sidebar` | Barra lateral izquierda: logo, navegación (Projects, Mentorías, Blog) |
| `NotificationBell` | Campana con badge de no leídas, polling cada 10min |
| `ThemeApplier` | Aplica clase `dark` al `<html>` según store |
| `ThemeSwitcher` | Botón para ciclar entre light/dark/system |
| `BackgroundEffects` | Estrellas (dark) o blobs aurora (light) de fondo |
| `MenuButton` | Botón hamburger para menú móvil |

### UI por Dominio (`src/components/ui/`)

**Cards**
| Componente | Descripción |
|---|---|
| `ProjectCard` | Tarjeta de proyecto (variante full/compact), tech badges, rating |
| `FeedbackCard` | Tarjeta de feedback con rating, autor, toggle de comentarios |
| `Mentorshipcard` | Tarjeta de mentoría con precio, plataforma, status, acciones |
| `CommentCard` | Tarjeta de comentario individual |

**Modales**
| Componente | Descripción |
|---|---|
| `Modal` | Wrapper genérico: header, scroll, close |
| `GiveKudoModal` | Dialog de Headless UI para enviar kudos |

**Formularios**
| Componente | Descripción |
|---|---|
| `ProjectForm` | Crear/editar proyecto (~460 líneas): MD editor, MultiSelect, RocketSlider |
| `MentorshipForm` | Crear/editar mentoría (~499 líneas): horarios dinámicos, plataformas |
| `FeedbackForm` | Dar feedback: RocketSlider + textarea |
| `CommentForm` | Responder a feedback: textarea |

**Feedback & Comentarios**
| Componente | Descripción |
|---|---|
| `CommentThread` | Hilo de comentarios de un feedback |
| `CommentNode` | Nodo recursivo de comentario con replies |

**Project Detail**
| Componente | Descripción |
|---|---|
| `ProjectMainContent` | Contenido principal: descripción MD, tecnologías |
| `ProjectSidePanel` | Panel lateral: estado, links, progreso, autor |

**Project Home**
| Componente | Descripción |
|---|---|
| `ProjectList` | Lista paginada de proyectos con sorting |
| `ProjectHomeSide` | Sidebar de la home (filtros, info extra) |

**Notificaciones**
| Componente | Descripción |
|---|---|
| `NotificationDropdown` | Lista de notificaciones con scroll |
| `NotificationItem` | Item individual de notificación |

**Utilidades UI**
| Componente | Descripción |
|---|---|
| `MultiSelect` | Wrapper de react-select para tecnologías |
| `FormSidePanel` | Panel de ayuda contextual en formularios |

### UX (`src/components/ux/`)

| Componente | Descripción |
|---|---|
| `Loading` | Mensaje de carga simple |
| `StarRating` | 5 estrellas SVG con relleno parcial por gradiente |
| `RocketSlider` | Slider custom con emoji cohete 🚀 para rating |

### Botón (`src/components/button/`)

| Componente | Descripción |
|---|---|
| `RoundedButton` | Botón flexible: variantes primary/secondary/outline, tamaños, íconos, link |

### Provider (`src/components/providers/`)

| Componente | Descripción |
|---|---|
| `AuthProvider` | Inicializa auth desde localStorage al arrancar la app |

---

## 9. RESUMEN — Estado del DDD

### ✅ Features COMPLETAS

| Feature | Detalle |
|---|---|
| **Autenticación** | Login, Register, JWT, interceptores, logout automático en 401, rutas públicas/protegidas |
| **Proyectos — CRUD** | Crear, leer (listado + detalle), editar. Paginación + sorting (LATEST, TOP_RATED, MOST_FEEDBACK) |
| **Feedback** | Crear, leer, editar, eliminar. Validación rating 1-10. Prevención de auto-feedback |
| **Comentarios** | Sistema anidado: crear, editar, eliminar, replies con `parentCommentId` |
| **Kudos** | Enviar kudo con mensaje y referencia a proyecto. Modal de envío |
| **Notificaciones** | Listar, marcar leída/todas leídas, badge con unread count, polling cada 10min |
| **Tema** | Light / Dark / System, persistido, aplicado globalmente |
| **Admin Dashboard** | Listar solicitudes de mentor, aprobar/rechazar con motivo |
| **Solicitud de Upgrade a Mentor** | DEV puede solicitar ser mentor (requiere 3+ proyectos publicados) |
| **Mentorías — CRUD** | Crear, leer (mis mentorías), editar, eliminar, pausar/activar |

### ⚠️ Features PARCIALES

| Feature | Implementado | Falta |
|---|---|---|
| **Rutas (DDD paths)** | Todas las vistas existen | Los paths no coinciden con el DDD: `/create-project` vs `/projects/new`, `/project/:slug` vs `/proyect/:slug`, `/create-mentorship` vs `/mentoring/new` |
| **Perfil Público** | `ProfilePage` con vista pública/privada, kudos, proyectos, experiencia | Ruta `/portfolio/:slug` del DDD usa nombre diferente; no hay separación clara entre "mi perfil" y "portfolio público de otro usuario" |
| **Proyectos — Editar ruta dedicada** | La edición funciona vía modal en el dashboard | No existe ruta `/projects/:slug/edit` como página independiente |
| **Mentorías — Detalle público** | `MentorshipDetailResponse` tipo definido, `fetchMentorshipById` implementado | No existe página `/mentoring/:slug`, ni listado público `/mentoring` |
| **Dashboard multi-rol** | `DeveloperDashboard`, `MentorDashboard`, `AdminDashboard` separados | El router los distingue por rol, pero ambos DEV y MENTOR usan `/dashboard` — el DDD podría esperar vistas diferentes |
| **Settings** | `EditProfilePage` cubre parte de la configuración de perfil | No existe `/settings` como ruta/página dedicada a configuración de cuenta |
| **Proyectos — Visibilidad pública** | Los proyectos se pueden ver sin que el backend lo requiera | `ProjectDetailPage` y `HomePage` están actualmente detrás de `ProtectedRoute`; el DDD implica que `/proyect/:slug` debe ser público |

### ❌ Features NO INICIADAS

| Feature | Descripción |
|---|---|
| **Mentoring — Listado público** | Página `/mentoring` con listado de mentores/mentorías disponibles para explorar |
| **Mentoring — Vista detalle pública** | Página `/mentoring/:slug` con perfil del mentor, horarios, precio, botón de booking |
| **Booking de sesiones de mentoría** | El tipo `totalBookings` existe en `MentorshipSummaryResponse` pero no hay UI ni endpoint de reserva |
| **Mentoring — Modal de oferta (botón "Ofrecer Mentoría")** | TODO.md indica: en proyectos con `needMentoring=true`, mentores deben poder ofrecerse vía modal con mensaje |
| **Proyectos — Modal colaboración** | TODO.md indica: en proyectos con `isCollaborative=true`, usuarios deben poder ofrecerse a colaborar vía modal |
| **ProjectDetail — Sidebar condicional** | TODO.md: links al repo/proyecto solo si existen los campos (parcialmente implementado, revisar) |
| **ProjectDetail — Responsive** | TODO.md: layout responsive pendiente |
| **ProjectDetail — Enlace a perfil del developer** | TODO.md: enlace al perfil del autor del proyecto |
| **Blog** | Sidebar tiene enlace a "Blog" pero está deshabilitado (`disabled` / `coming soon`) |
| **Búsqueda y filtros** | No existe búsqueda de proyectos ni filtros por tecnología/estado en el listado |
| **Paginación de mentorías** | Solo se cargan "mis mentorías"; no hay paginación en listado público |

---

## 10. CÓDIGO QUE NO CORRESPONDE AL DDD / A REVISAR

| Elemento | Problema | Recomendación |
|---|---|---|
| `react-md-editor` (v0.2.2) | Duplicado con `@uiw/react-md-editor` (v4.0.8) — mismo paquete, versión vieja | Eliminar `react-md-editor` de `package.json` |
| `src/utils/authMigration.md` | Archivo Markdown dentro de `src/utils/` — no es código | Mover a documentación o eliminar |
| Rutas con nombres distintos al DDD | `/create-project`, `/project/:projectSlug`, `/create-mentorship` difieren del DDD | Alinear con `/projects/new`, `/proyect/:slug`, `/mentoring/new` (o actualizar el DDD) |
| `ProtectedRoute` en todas las rutas | `/home`, `/project/:slug` deberían ser públicas según DDD | Convertir a rutas públicas para no requerir login |
| `@headlessui/react` versión `0.0.0-insiders` | Versión insiders/inestable, solo usada en `GiveKudoModal` | Actualizar a versión estable o reemplazar con implementación propia |
| `src/pages/dashboard/MentorDashboard.tsx` y `DeveloperDashboard.tsx` en `/dashboard` | Ambos roles usan la misma ruta — el DDD podría separarlos o no | Verificar si el DDD prevé roles distintos con misma URL |
| `react-select` (5.10.1) más `@types/react-select` | Tipado incorrecto: `@types/react-select` es para v2, react-select v5 incluye sus propios tipos | Eliminar `@types/react-select` del devDependencies |
| No existe `queryKeys.ts` centralizado | Query keys definidos inline en cada componente | Crear `src/api/queryKeys.ts` para evitar typos y facilitar invalidaciones |
| Polling de notificaciones hardcodeado en `NotificationBell` | `refetchInterval: 1000 * 60 * 10` hardcodeado | Mover a constante configurable |

---

## 11. ÁRBOL DE DEPENDENCIAS DE FEATURES

```
Auth ──────────────────────────────── ✅ Completo
  └─ JWT Store (Zustand) ──────────── ✅ Completo
  └─ Interceptores Axios ──────────── ✅ Completo
  └─ Rutas protegidas/públicas ─────── ✅ Completo

Proyectos
  ├─ Listado público home ──────────── ⚠️ Funciona pero ruta protegida
  ├─ Detalle público ───────────────── ⚠️ Funciona pero ruta protegida
  ├─ Crear proyecto ────────────────── ✅ Completo (path diferente DDD)
  ├─ Editar proyecto ───────────────── ⚠️ Solo en modal, sin ruta propia
  ├─ Eliminar proyecto ─────────────── ❓ No visto en UI (revisar)
  ├─ Feedback ──────────────────────── ✅ Completo
  │   └─ Comentarios ───────────────── ✅ Completo (anidados)
  ├─ Modal colaboración ────────────── ❌ No iniciado
  └─ Modal oferta mentoría ─────────── ❌ No iniciado

Perfil
  ├─ Ver perfil propio ─────────────── ✅ Completo
  ├─ Ver perfil público (/portfolio) ── ⚠️ Funciona, path diferente DDD
  ├─ Editar perfil ─────────────────── ✅ Completo
  └─ Kudos ─────────────────────────── ✅ Completo

Mentorías
  ├─ Crear mentoría ────────────────── ✅ Completo (path diferente DDD)
  ├─ Mis mentorías (dashboard) ──────── ✅ Completo
  ├─ Editar mentoría ───────────────── ⚠️ Solo en modal, sin ruta propia
  ├─ Eliminar mentoría ─────────────── ✅ Completo
  ├─ Pausar/activar mentoría ───────── ✅ Completo
  ├─ Listado público /mentoring ────── ❌ No iniciado
  ├─ Detalle público /mentoring/:slug ─ ❌ No iniciado
  └─ Booking de sesión ─────────────── ❌ No iniciado

Notificaciones ──────────────────────── ✅ Completo (polling + read)

Admin
  ├─ Solicitudes de mentor ─────────── ✅ Completo
  └─ Aprobar/Rechazar ──────────────── ✅ Completo

Settings (/settings) ────────────────── ❌ No iniciado (cubierto parcialmente por /profile/edit)

Blog ─────────────────────────────────── ❌ No iniciado (placeholder en Sidebar)

Búsqueda / Filtros ───────────────────── ❌ No iniciado
```

---

*Fin del análisis — incubadora.dev frontend | 2026-03-16*
