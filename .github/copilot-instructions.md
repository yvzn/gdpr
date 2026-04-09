# Copilot Cloud Agent Instructions

> Trust these instructions. Only search the codebase if information here is incomplete or found to be incorrect.

## Repository Overview

**GdprRecord** is a GDPR record-of-processing-activities management application. It has two top-level projects:

- **`api/`** — ASP.NET Core 10 Web API (C#, .NET 10, SQLite via EF Core, Mediator pattern)
- **`app/`** — Angular 21 SPA (TypeScript 5.9, Angular Material, NgRx Signals + Store, i18n with `@angular/localize`)

There are no CI/CD pipelines or GitHub Actions workflows configured.

## Runtime & Tool Versions

| Tool | Version |
|---|---|
| .NET SDK | 10.0.x (targets `net10.0`) |
| Node.js | 24.x |
| npm | 11.10.x |
| Angular CLI | 21.x |
| TypeScript | 5.9.x |
| EF Core CLI | 10.0.5 (local tool) |

## UX Considerations

### Use the List / Details pattern for all entities
For example:
- Card-based list of all activities (no tables, use cards for layout)
- Form to create or update a new processing activity
- Client-side filtering and pagination for the list

### Shared Requirements
- Prefer Angular ReactiveForms with Angular Material components (do not use template-driven forms)
- Prefer NGRX for state management, including actions / action creators, reducers, selectors, and effects for API interactions
- Keep HTML templates in separate files from component logic
- internationalize the application using the Angular localize package
- Put all related code (routing, views, components, etc.) in the corresponding Angular library, for increased modularity and avoiding large shared modules
- Use skeleton placeholders during HTTP requests to keep the user waiting
- Provide clear, actionnable user feedback
- Ensure keyboard accessibility and accessibility for impaired users
- Maintain consistent styling within the application, using Angular Material theming, appropriate spacing and icons, and responsive design for different screen sizes

Make sure all UI flows have clean UX with card views and easy navigation between lists and details. Prioritize maintainable code structure and reuse components where feasible.

## Build & Validate — API (`api/`)

Always run commands from the `api/` directory.

```bash
cd api

# 1. Restore NuGet packages
dotnet restore

# 2. Build the solution
dotnet build
```

- The solution file is `GdprRecord.Api.slnx` (XML-based slnx format).
- There are **no .NET test projects**. `dotnet test` completes with no tests.

### EF Core Migrations

EF Core CLI is a local dotnet tool. Always restore tools first:

```bash
dotnet tool restore

# Apply migrations (Organization feature)
dotnet ef database update --project ./src/GdprRecord.Server.Feature.Organization/

# Apply migrations (ProcessingActivity feature)
dotnet ef database update --project ./src/GdprRecord.Server.Feature.ProcessingActivity/

# Create new migration
dotnet ef migrations add <MigrationName> --project ./src/GdprRecord.Server.Feature.Organization/
dotnet ef migrations add <MigrationName> --project ./src/GdprRecord.Server.Feature.ProcessingActivity/
```

SQLite databases are stored in `LocalApplicationData/GdprRecord/` (auto-created at startup).

### Running the API

```bash
dotnet run --project ./src/GdprRecord.Server/
```

API runs on `http://localhost:5220` (and `https://localhost:7290`). Swagger UI at `/swagger` in Development.

## Build & Validate — Frontend (`app/`)

Always run commands from the `app/` directory. Always run `npm ci` (or `npm install`) before building.

```bash
cd app

# 1. Install dependencies (always do this first)
npm ci

# 2. Build the application (production)
npx ng build

# 3. Lint (oxlint)
npm run lint

# 4. Format check (oxfmt)
npm run fmt:check

# 5. Auto-fix formatting
npm run fmt

# 6. Auto-fix lint issues
npm run lint:fix
```

### Running Tests

To run tests that pass:

```bash
# Run library tests individually (these pass with exit code 0):
npx ng test --project=organization-feature --watch=false
npx ng test --project=processing-activity-feature --watch=false
```

Always use `--watch=false` in non-interactive/CI contexts.

### Linting & Formatting

- **Linter:** oxlint (config: `.oxlintrc.json`)
- **Formatter:** oxfmt (config: `.oxfmtrc.json` — uses tabs, single quotes, 100 char width)
- `ng lint` does **NOT** work (no Angular lint target configured). Use `npm run lint` instead.
- After making code changes, always run `npm run fmt` then `npm run lint`.

## Project Architecture

### API Structure (`api/src/`)

```
GdprRecord.Server/              — Main ASP.NET Core host (Program.cs entry point)
GdprRecord.Server.Feature.Organization/    — Organization & Person management feature
  Controllers/                  — OrganizationsController, PeopleController
  Commands/                     — CQRS commands (CreatePersonCommand, UpdateOrganizationCommand, etc.)
  Queries/                      — CQRS queries (ReadAllOrganizationsQuery, etc.)
  Model/                        — Entity classes (Organization, Person)
  Infrastructure/               — EF Core DbContext (OrganizationContext), DB initializer
  Migrations/                   — EF Core migrations
GdprRecord.Server.Feature.ProcessingActivity/ — Processing activity GDPR records feature
  Controllers/                  — ProcessingActivitiesController
  Commands/                     — CreateProcessingActivityCommand
  Queries/                      — ReadAllProcessingActivitiesQuery
  Model/                        — ProcessingActivity, Purpose, PersonalData, etc.
  Infrastructure/               — ProcessingActivityContext, DB initializer
  Migrations/                   — EF Core migrations
```

**Patterns used:**
- **CQRS** with Mediator source generator (`Mediator.SourceGenerator`). Commands implement `ICommand<T>`, queries implement `IQuery<T>`, handlers implement `ICommandHandler<,>` / `IQueryHandler<,>`.
- **Result pattern** — each feature has a `Result.cs` with `Result<TValue>` and `Error` enum.
- **Mapster** for object mapping (not AutoMapper).
- **FluentValidation** for request validation.
- Each feature registers itself via `AddXxxFeature()` / `UseXxxFeature()` extension methods in its `IXxxFeature.cs` file.
- Each feature has its own SQLite database and DbContext.

### Frontend Structure (`app/`)

```
src/                            — Main application
  main.ts                       — Bootstrap with i18n (loadTranslations for fr locale)
  app/
    app.ts                      — Root component (Material sidenav layout)
    app.config.ts               — Providers (router, httpClient, ngrx store, locale)
    app.routes.ts               — Lazy-loaded routes to feature library components
    i18n/                       — App-level translation files (en.json, fr.json)
    header/                     — Header component
    main-menu/                  — Main menu component
projects/
  organization-feature/         — Angular library
    src/lib/
      views/                    — organization-list, organization-detail, person-list, person-detail
      components/               — error-banner, people-picker-dialog, skeleton-card, skeleton-detail
      services/                 — organization.service.ts, person.service.ts
      store/                    — NgRx signal store (organization.store.ts, person.store.ts)
      models/                   — organization.model.ts, person.model.ts
      i18n/                     — Feature-level translations (fr.json)
  processing-activity-feature/  — Angular library
    src/lib/
      views/                    — activity-list, activity-create
      components/               — error-banner, skeleton-card
      services/                 — processing-activity.service.ts
      store/                    — NgRx classic store (actions, effects, reducer, selectors)
      models/                   — processing-activity.model.ts
      i18n/                     — Feature-level translations (fr.json)
```

**Key conventions:**
- Angular 21 — standalone components by default (do NOT set `standalone: true`, it's the default).
- `ChangeDetectionStrategy.OnPush` required on all components.
- Use `input()`/`output()` signal functions, not decorators.
- Use native control flow (`@if`, `@for`, `@switch`), not structural directives.
- Use `inject()` function, not constructor injection.
- SCSS for styles, Angular Material for UI.
- Feature libraries are imported via relative paths in `app.routes.ts`, not npm package paths.
- `tsconfig.json` path mappings point `organization-feature` and `processing-activity-feature` to `./dist/` (built library output), but the app build resolves source directly.
- Organization feature uses **NgRx Signal Store**. Processing activity feature uses **NgRx classic Store** (actions/effects/reducer/selectors pattern).
- i18n uses `@angular/localize` with `$localize` tagged templates. Translation IDs use the format `@@section.context.key`.

### Proxy Configuration

`app/src/proxy.conf.json` proxies `/api/**` requests to `http://localhost:5220` (the .NET API). The API must be running when using `ng serve`.

## EditorConfig

- `api/.editorconfig`: tabs, indent size 4, CRLF
- `app/.editorconfig`: tabs, indent size 4, single quotes for TS

## Key Files Reference

| Purpose | Path |
|---|---|
| .NET solution | `api/GdprRecord.Api.slnx` |
| API entry point | `api/src/GdprRecord.Server/Program.cs` |
| .NET local tools | `api/dotnet-tools.json` |
| Angular workspace | `app/angular.json` |
| npm scripts | `app/package.json` |
| App entry point | `app/src/main.ts` |
| App routes | `app/src/app/app.routes.ts` |
| App config | `app/src/app/app.config.ts` |
| Lint config | `app/.oxlintrc.json` |
| Format config | `app/.oxfmtrc.json` |
| API proxy | `app/src/proxy.conf.json` |
| Root gitignore | `.gitignore` |
| Angular copilot prefs | `app/.github/copilot-instructions.md` |
