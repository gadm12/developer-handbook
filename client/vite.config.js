import { defineConfig } from 'vite'

// Project site at https://gadm12.github.io/developer-handbook/ — without this
// base every built asset URL resolves to the domain root and 404s.
export default defineConfig({
  base: '/developer-handbook/',
})
