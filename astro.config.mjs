import { defineConfig } from 'astro/config';

// Static site. Remote photographs stay at their public URLs; Astro must not
// download them into the build. Production Pages still serves main until a
// later, approved deploy.
export default defineConfig({
  site: 'https://schoolai.linalopes.info',
  output: 'static',
  prefetch: false,
  build: {
    inlineStylesheets: 'always',
  },
});
