# front-react-incubadora

React 19 + TypeScript frontend for an incubator/mentoring platform.

## Stack

- **Build**: Vite 6, TypeScript ~5.8
- **UI**: React 19, TailwindCSS 4, Headless UI, Lucide React
- **Routing**: React Router v7
- **State**: Zustand (auth + theme stores)
- **Data fetching**: TanStack React Query v5
- **Forms**: React Hook Form
- **HTTP**: Axios (`src/api/apiService.ts`)
- **Package manager**: pnpm

## Commands

```bash
pnpm dev        # Start dev server
pnpm build      # Type-check + build
pnpm lint       # ESLint
pnpm preview    # Preview production build
```

## Project Structure

```
src/
  api/
    apiService.ts       # Axios instance (base URL, interceptors, JWT)
    queries.ts          # All API query/mutation functions
  components/
    layout/             # Sidebar, Navbar, AuthenticatedLayout, ThemeApplier, etc.
    ui/                 # Feature UI components (cards, modals, forms, etc.)
    ux/                 # Generic UX (Loading, StarRating, RocketSlider)
    button/             # Button components
    providers/          # AuthProvider
  hooks/                # Custom hooks (useAuthZustand, useProjectRating, etc.)
  pages/
    auth/               # LoginPage, RegisterPage
    dashboard/          # DeveloperDashboard, AdminDashboard, MentorDashboard,
                        # CreateProjectPage, CreateMentorshipPage
    profile/            # ProfilePage, EditProfilePage
    HomePage.tsx
    ProjectDetailPage.tsx
    NotFound.tsx
  router/
    index.tsx           # Route definitions
    ProtectedRoute.tsx  # Requires authenticated user
    PublicRoute.tsx     # Redirects logged-in users away
    RoleBasedRedirect.tsx # Redirects "/" based on role
  stores/
    authStore.ts        # Zustand auth store
    themeStore.ts       # Zustand theme store
  types/index.ts        # All TypeScript interfaces and types
```

## Roles & Routing

Three user roles: `DEVELOPER`, `MENTOR`, `ADMIN`

| Route | Access |
|-------|--------|
| `/dashboard` | All authenticated users (developer view) |
| `/admin` | ADMIN only |
| `/mentor-dashboard` | MENTOR only |
| `/create-mentorship` | MENTOR only |
| `/create-project` | Authenticated |
| `/home` | Authenticated |

Role-based redirect at `/` → handled by `RoleBasedRedirect.tsx`.

## API Conventions

All API functions live in `src/api/queries.ts` and use the `apiService` Axios instance. The base URL and JWT injection are configured in `src/api/apiService.ts`. Endpoints follow REST conventions:

- Auth: `/auth/login`, `/auth/register`
- Profile: `/me/profile`, `/profiles/{slug}`
- Projects: `/projects`, `/projects/my-projects`, `/projects/{slug}`
- Mentorships: `/mentorships`, `/mentorships/my-mentorships`, `/mentorships/{id}`
- Feedback: `/projects/{slug}/feedback`, `/feedback/{id}`
- Comments: `/feedback/{id}/comments`, `/comments/{id}`
- Notifications: `/notifications`
- Admin: `/dashboard/admin/mentor-requests`, `/admin/mentor-requests/{id}/approve|reject`

## Types

All types/interfaces are defined in `src/types/index.ts`. Add new types there.

## Notes

- Comments and variable names are mostly in Spanish throughout the codebase — keep this consistent.
- The project uses TailwindCSS v4 (config via `@tailwindcss/vite` plugin, not `tailwind.config.js`).
- Active branch for mentoring features: `feat/mentoring-page`.
