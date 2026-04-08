# Copilot Instructions

This is a **GDPR Record of Processing Activities (RoPA)** application. It is a full-stack web app with two top-level directories:

- `api/` — .NET 10 backend (C#)
- `app/` — Angular 21 frontend (TypeScript)

---

## Repository Structure

```
api/
  GdprRecord.Api.slnx            # Solution file
  src/
    GdprRecord.Server/           # ASP.NET Core web host (entry point)
    GdprRecord.Server.Feature.Organization/   # Organization & People feature (CQRS, EF Core, SQLite)
    GdprRecord.Server.Feature.ProcessingActivity/  # ProcessingActivity model (stub/future)

app/
  src/
    app/                         # Shell app (routing, layout, i18n)
      i18n/                      # App-level translation JSON files (en.json, fr.json)
  projects/
    organization-feature/        # Angular library: models, services, stores, views, components
      src/lib/
        models/                  # TypeScript interfaces (organization.model.ts, person.model.ts)
        services/                # HTTP services (organization.service.ts, person.service.ts)
        store/                   # NGRX SignalStore stores (organization.store.ts, person.store.ts)
        views/                   # Routed view components (organization-list, organization-detail, person-list, person-detail)
        components/              # Shared/reusable components (error-banner, people-picker-dialog, skeleton-card, skeleton-detail)
        i18n/                    # Library-level translation JSON files (en.json, fr.json)
```

---

## Backend (api/)

### Tech Stack
- **.NET 10**, C#, `nullable enable`, `implicitUsings enable`
- **ASP.NET Core** MVC controllers (`[ApiController]`)
- **EF Core 10** with **SQLite** (`Microsoft.EntityFrameworkCore.Sqlite`)
- **Mediator** (`Mediator.SourceGenerator` v3) for CQRS — use `IQuery<T>` / `ICommand<T>` interfaces defined in `Result.cs`
- **Mapster** for object mapping; mapper profiles use `TypeAdapterConfig`
- **FluentValidation** with auto-validation (`AddFluentValidationAutoValidation`)
- **Swagger/OpenAPI** enabled in development

### Key Conventions
- Feature registration via extension methods: `AddOrganizationFeature()` / `UseOrganizationFeature()` in `IOrganizationFeature.cs`
- Result pattern: `Result<TValue>` with `Match(failure, success)` — handlers return `Error.NotFound`, `Error.Conflict`, or a value
- Commands and queries are `internal record` types; command/query handlers are `internal class`
- Public API surface for a feature: response DTOs and command records are `public record`
- Database: SQLite stored in `%LOCALAPPDATA%/GdprRecord/Organization.db`; migrated and seeded on startup

### Build & Run
```bash
# From api/ directory
dotnet build
dotnet run --project src/GdprRecord.Server

# EF Core migrations (run from api/src/ directory)
dotnet ef database update --project GdprRecord.Server.Feature.Organization/
dotnet ef migrations add <MigrationName> --project GdprRecord.Server.Feature.Organization/
dotnet ef database drop --project GdprRecord.Server.Feature.Organization/
```

### API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/organizations` | Returns `{ organizations: [...] }` |
| GET | `/api/organizations/{id}` | Returns single organization object |
| PUT | `/api/organizations/{id}` | Update organization |
| GET | `/api/people` | Returns `{ people: [...] }` |
| GET | `/api/people/{id}` | Returns single person object |
| PUT | `/api/people/{id}` | Update person |
| POST | `/api/people` | Create person, returns `201 Created` |

---

## Frontend (app/)

### Tech Stack
- **Angular 21** (standalone components — no NgModules)
- **@ngrx/signals** for state management (SignalStore)
- **Angular Material** (`@angular/material` + `@angular/cdk`) for UI components
- **@angular/localize** for i18n (English and French; locale selected at runtime via `localStorage`)
- **Vitest** for unit tests
- **Oxlint** for linting (`npm run lint`) and **Oxfmt** for formatting (`npm run fmt`)
- **SCSS** for styles

### Angular Conventions (strictly enforced in `app/.github/copilot-instructions.md`)
- **Standalone components only** — do NOT set `standalone: true` (it is the default in v20+)
- Use `input()` and `output()` functions, not `@Input`/`@Output` decorators
- Use `inject()` function, not constructor injection
- `ChangeDetectionStrategy.OnPush` on all components
- Use `computed()` for derived state
- Native control flow: `@if`, `@for`, `@switch` — do NOT use `*ngIf`, `*ngFor`, `*ngSwitch`
- Do NOT use `ngClass` or `ngStyle` — use `class` and `style` bindings
- Do NOT use `@HostBinding` / `@HostListener` — use the `host` object in `@Component`/`@Directive`
- Use `NgOptimizedImage` for all static images (not base64 inline images)
- Prefer Reactive forms over Template-driven forms
- Use the `async` pipe for observables in templates
- Component prefix for the library is `lib-`; for the shell app it is `app-`
- External templates/styles use paths relative to the component TS file

### i18n
- Translations use Angular's `$localize` tagged template literals
- Message IDs follow the pattern `@@namespace.key` (e.g., `@@org.error.loadAll`)
- Translation files are in `app/src/app/i18n/` (app-level) and `app/projects/organization-feature/src/lib/i18n/` (library-level)
- Supported locales: `en` (default), `fr`

### Build & Test Commands
```bash
# From app/ directory
npm run build -- --configuration development   # Development build (avoids Google Fonts inlining error in sandboxed environments)
npm run build                                  # Production build
npm test                                       # Run all unit tests with Vitest
npm run lint                                   # Lint with Oxlint
npm run lint:fix                               # Auto-fix lint issues
npm run fmt                                    # Format with Oxfmt
npm run fmt:check                              # Check formatting
npx ng generate component <name>               # Scaffold a new component
```

> **Known issue in sandboxed/offline environments**: The production build fails due to Google Fonts inlining. Always use `npm run build -- --configuration development` when building in such environments.

### Dev Server & API Proxy
- Dev server: `npm start` → `http://localhost:4200`
- API calls proxied to `http://localhost:5220` via `src/proxy.conf.json` (`/api/**`)

### NGRX SignalStore Pattern
Stores are in `projects/organization-feature/src/lib/store/`. They use:
- `withState()` for initial state
- `withComputed()` for derived signals
- `withMethods()` with `rxMethod` for async operations (load, update)
- `withHooks()` for lifecycle (e.g., `onInit` to trigger initial load)
- `patchState()` for state updates — do NOT use `mutate`
- Stores are provided `{ providedIn: 'root' }`

### Feature Library (`organization-feature`)
The library at `app/projects/organization-feature/` is used directly from source (not built/published). The `tsconfig.json` path alias `"organization-feature"` points to `./projects/organization-feature/src/public-api`.

Public API exports: routes, models, services, and stores.

---

## Accessibility
- All UI must pass AXE checks
- Must follow WCAG AA: focus management, color contrast, ARIA attributes

---

## Adding a New Feature

### Backend
1. Create a new project under `api/src/` following the `GdprRecord.Server.Feature.Organization` pattern
2. Define models in `Model/`, queries in `Queries/`, commands in `Commands/`
3. Implement `IQuery<T>`/`ICommand<T>` handlers returning `Result<T>`
4. Register via extension methods and add to `Program.cs`
5. Add EF Core migration if a new `DbContext` is needed

### Frontend
1. Add models to `models/`, services to `services/`, stores to `store/`
2. Add view components to `views/` and shared components to `components/`
3. Register routes in `app/src/app/app.routes.ts` (lazy-loaded)
4. Add translation keys to both `en.json` and `fr.json` files (app and library level)
