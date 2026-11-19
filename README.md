# Borderline.dev.br

Borderline.Dev is a bilingual personal services website for presenting high-end web development, interactive experiences, systems work, and infrastructure support for agency partners.

The repository is public as a portfolio artifact. The site itself is a production-oriented Vue application with a Three.js visual layer, localized SEO metadata, and a static build pipeline.

## Planejamento da V2

O [plano da V2](docs/v2/README.md) reúne direção criativa, arquitetura da informação, demonstrações, arquitetura técnica, backlog e workflow Git. O [registro de ideias](docs/v2/07-registro-de-ideias.md) acompanha as contribuições e correções durante o planejamento.

O **mediakit foi aprovado** e aplicado à entrada na branch `feat/v2-01-home`: menu, chapéu, título, texto, dois botões e cards da operação revelados por hover/scroll. Esta home aguarda validação visual do operador. O tema claro continua padrão, com escolha manual de claro/escuro sem acompanhar navegador ou sistema.

Com o servidor local iniciado, abrir **`/`** ou **`/en/`** para revisar a home. O mediakit continua em `/?view=mediakit` e `/en/?view=mediakit`. Consulte a [entrega da home e o roteiro de revisão](docs/v2/entregas/01-home-mediakit.md) e a [referência do mediakit](docs/v2/entregas/00-mediakit.md). O primeiro hero rejeitado está preservado no histórico de `feat/v2-01-hero`.

## Project Context

This project represents a service provider website, not a reusable library or SaaS product. It is designed to explain the work, present the brand, and provide a professional contact path through LinkedIn.

The V1 source preserved in this repository includes the following implementation. The V2 entry currently uses HTML/SVG/CSS; its Three.js demo runtime is planned separately:

- a Vue 3 single-page app;
- section-based page composition;
- a shared Three.js scene backdrop;
- Portuguese and English content;
- SEO and social metadata generated from centralized content;
- a post-build step that creates the localized `/en/` page.

## Stack

- Vue 3
- Vite
- Three.js
- Less
- ESLint flat config
- pnpm

## Verifiable Features

- Bilingual content for Portuguese and English.
- Locale-aware document metadata and JSON-LD structured data.
- Responsive section layout built from Vue components.
- A lazy-loaded Three.js scene system shared across page sections.
- GLTF, OBJ, KTX2, and Meshopt asset loading for the hero scene.
- Preload/loading flow for 3D assets and browser load readiness.
- Static production build with an additional localized English HTML file.

## Technical Decisions

- Content and SEO data live in `src/i18n/siteContent.mjs` so visible copy, metadata, canonical URLs, alternate URLs, and structured data stay aligned.
- The 3D backdrop is isolated in `SceneBackdrop.vue` and delegates individual visual states to scene modules in `src/scenes`.
- The Vite base is configured as `./`, which keeps the build portable across static hosting environments and supports the generated `/en/` page.
- Runtime secrets are not required. Public URLs in the code are intentional site metadata and contact links.

## Repository Structure

```text
.
|-- public/                  Static assets, icons, social images, and 3D models
|-- scripts/                 Build helper for localized HTML output
|-- src/
|   |-- components/          Vue UI sections and shared components
|   |-- i18n/                Localized content, SEO metadata, and JSON-LD helpers
|   |-- scenes/              Three.js scene modules used by the backdrop
|   |-- styles/              Less stylesheet for the application
|   `-- App.vue              Main application shell
|-- docs/                    Architecture and portfolio notes
|-- index.html               Vite HTML entry with baseline metadata
|-- package.json             Scripts and dependencies
`-- vite.config.mjs          Vite configuration
```

## Getting Started

Requirements:

- Node.js 22 or newer is recommended for the current tooling.
- pnpm 11 or compatible.

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm run dev
```

Run a host-accessible development server:

```bash
pnpm run serve
```

Lint the source:

```bash
pnpm run lint
```

Build for production:

```bash
pnpm run build
```

Preview the production build:

```bash
pnpm run preview
```

## Build and Deploy

`pnpm run build` runs Vite and then executes `scripts/create-localized-build.mjs`.

The final static output is written to `dist/`, including:

- `dist/index.html` for Portuguese;
- `dist/en/index.html` for English;
- copied static assets from `public/`.

The project can be deployed to any static hosting provider that serves the generated `dist/` directory.

## Configuration

No environment variables are required for local development or production build. See `.env.example` for the explicit placeholder.

If the public URL or deployment path changes, update the centralized site constants in `src/i18n/siteContent.mjs` and review `vite.config.mjs`.

## Screenshots

Screenshots are not committed yet. Recommended portfolio captures:

- home/hero section;
- one service section with the 3D backdrop visible;
- contact section;
- English localized page.

## Quality

The available local quality checks are:

- `pnpm run lint`;
- `pnpm run build`.

The V2 includes eight Node logic tests and a GitHub Actions workflow for locked dependency installation, logic checks and the PT/EN production build. Browser validation is performed exclusively by the operator. Lint remains available on request; it is not part of this CI workflow.

## Security Notes

No credentials, tokens, private keys, or environment files were found in the repository review. Public website URLs and LinkedIn links are intentional profile and SEO data.

## Status

Portfolio-ready source for a personal services website. The project is suitable for demonstrating frontend architecture, interactive visual work, SEO care, localization, and static build discipline.

For a technical overview, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

For hiring-focused context, see [docs/RECRUITER_NOTES.md](docs/RECRUITER_NOTES.md).

## Validação e contribuições

- O agente nunca testa em navegador. O operador valida as mudanças e retorna os problemas encontrados.
- Usar pnpm e Docker quando necessários; o site estático atual não exige Docker.
- Todo commit deve usar a identidade `Mário Veronesi Medina <mazen.mario@gmail.com>`.
- Preservar alterações locais que não pertençam à tarefa.
- Consultar o [workflow da V2](docs/v2/05-roadmap-e-git.md) antes de iniciar uma entrega dessa versão.

[contexto.txt](contexto.txt) contém a direção original da marca. Para a V2, as decisões atuais sobre público, conteúdo e interação estão em `docs/v2/`; os fundamentos visuais do contexto original continuam como referência.
