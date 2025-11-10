# Repository Guidelines

## Project Structure & Module Organization
- `src/app` bootstraps NestJS, wiring global pipes, Swagger, and the root `AppModule`.
- Feature logic lives in `src/modules`, with reusable helpers in `src/shared` and persistent models in `src/entities`.
- Infrastructure code (`src/infra`) wraps TypeORM setup; database migrations reside in `src/migrations`.
- Runtime configuration is centralized in `src/config`, while static assets are under `src/assets`.
- End-to-end harness and config files sit in `test`, and production bundles are emitted to `dist/` after builds.

## Build, Test, and Development Commands
- `yarn start:dev` launches the API with hot reload; prefer this during active development.
- `yarn start` and `yarn start:prod` start compiled builds from `dist/`; use `yarn build` beforehand.
- `yarn lint` and `yarn format` enforce the ESLint + Prettier rule set across `src`, `apps`, `libs`, and `test`.
- Database changes flow through TypeORM CLI wrappers: `yarn migration:generate`, `yarn migration:run`, `yarn migration:revert`.

## Coding Style & Naming Conventions
- TypeScript with 2-space indentation, semicolons, and explicit return types on exported methods.
- Follow NestJS patterns: modules and providers in PascalCase (`UsersModule`), files in kebab-case (`users.module.ts`), database tables via snake_case migrations.
- Run Prettier before committing; ESLint warns on unchecked promises and enforces padding blank lines between imports, declarations, and `return`.
- Keep DTOs and entity schemas in their dedicated folders; avoid circular dependencies by re-exporting from feature `index.ts` files where needed.

## Testing Guidelines
- Unit specs (`*.spec.ts`) live beside implementation inside `src`; integration and e2e coverage live in `test/`.
- `yarn test` runs the Jest suite; `yarn test:e2e` targets the e2e harness; `yarn test:cov` tracks coverage output in `coverage/`.
- Add or update tests whenever you touch business logic, guarding new code paths and validating validator rules.
- Mock external services through Nest testing modules; avoid hard-coded credentials by reading from the configuration service.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commits style (`feat:`, `fix:`, `refactor:`) observed in Git history.
- Group related changes per commit; include migration artifacts in the same commit that introduces their corresponding models.
- Pull requests should describe scope, highlight breaking changes, list manual test commands run, and link issues or tickets.
- Attach API contract updates (Swagger screenshots or OpenAPI diffs) whenever you add or modify endpoints.

## Environment & Security Notes
- Configuration reads from environment variables via `src/config/configuration.ts`; supply a `.env.local` during development and never commit secrets.
- Verify new modules expose only the routes needed; update CORS or Swagger guards if you introduce protected endpoints.
