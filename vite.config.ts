import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import monkey from 'vite-plugin-monkey'
import packgeJson from './package.json'
import Rexport from './plugin/rexport'

export default defineConfig(config => ({
  plugins: [
    vue(),
    Rexport(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
      ],
    }),
    // import text file will cause error
    config.mode === 'test'
      ? undefined
      : monkey({
        entry: 'src/main.ts',
        userscript: {
          icon: 'https://api.iconify.design/hugeicons:translation.svg?color=%230080ff',
          version: process.env.RESOLVED_VERSION ?? packgeJson.version,
          name: 'tonarinoyj 下载工具',
          namespace: 'unlucky.ninja',
          author: 'UnluckyNinja',
          match: ['https://tonarinoyj.jp/episode/*'],
        },
        // build: {
        //   externalGlobals: {
        //     vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        //   },
        // },
      }),
    Inspect(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
