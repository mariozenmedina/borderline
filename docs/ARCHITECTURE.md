# Architecture

Borderline.Dev is a Vue 3 and Vite static site with a shared Three.js backdrop. The code is organized around page sections, localized content, and scene modules.

## Runtime Flow

1. `src/main.js` mounts the Vue application.
2. `src/App.vue` determines the locale from the URL and loads localized content from `src/i18n/siteContent.mjs`.
3. The app renders section components in a fixed order.
4. `SceneBackdrop.vue` initializes the Three.js renderer, camera, environment, and scene registry.
5. Each section declares a `data-scene` value. The backdrop observes visible sections and transitions between scene modules.
6. The loading screen waits for the initial scene, selected assets, document fonts, and window load readiness.

## Localization and SEO

Localized content, SEO metadata, social images, canonical URLs, alternate URLs, and JSON-LD data are centralized in `src/i18n/siteContent.mjs`.

During the production build, `scripts/create-localized-build.mjs` reads the generated Vite HTML and writes `dist/en/index.html` with English metadata and localized HTML attributes.

## Scene System

The scene registry lives in `src/scenes/index.js`. Each scene module is responsible for mounting its own Three.js objects, exposing optional resize and animation hooks, and cleaning up resources when unmounted.

Shared scene utilities live in `src/scenes/sceneUtils.js`.

The current hero scene loads:

- `public/models/gltf/facecap.glb`;
- `public/models/obj/oculos.obj`;
- KTX2 transcoder assets from `public/`.

## Build Output

The production build is static and can be served from the `dist/` directory. The Vite base is `./`, which helps the generated files work in static hosting contexts.

## Current Limitations

- No unit tests or browser automation are included.
- Screenshots are not committed.
- The project depends on browser support for modern JavaScript, WebGL, and the asset formats used by Three.js loaders.
