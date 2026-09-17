import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { parse } from 'yaml'

/**
 * Serves `<topic>.md?meta` as the file's parsed frontmatter, and nothing else.
 *
 * The home page needs every topic's metadata but none of their prose. Without
 * this, an eager `?raw` glob pulls all of the lesson bodies into the home-page
 * chunk and the lazy-loaded lesson page saves nothing.
 *
 * Parsing here rather than in the browser also means a malformed frontmatter
 * block fails the build instead of throwing at module load and blanking the
 * whole site.
 */
function topicFrontmatter(): Plugin {
  return {
    name: 'topic-frontmatter',
    enforce: 'pre',
    load(id) {
      const [file, query] = id.split('?')
      if (!query || !query.split('&').includes('meta')) return null

      const raw = readFileSync(file, 'utf8')
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      if (!match) {
        this.error(`Topic file "${file}" is missing its frontmatter block.`)
      }

      try {
        return `export default ${JSON.stringify(parse(match![1]))}`
      } catch (error) {
        this.error(`Topic file "${file}" has invalid frontmatter: ${String(error)}`)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Served from https://edriso.github.io/nt-trainings/
  base: '/nt-trainings/',
  plugins: [topicFrontmatter(), react(), tailwindcss()],
})
