import { defineConfig, presetIcons, presetTypography, presetWind4 } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { presetShadcn } from 'unocss-preset-shadcn'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetWind4(),
    presetIcons(),
    presetTypography(),
    presetAnimations(),
    presetShadcn(
      {
        color: 'blue',
        // With default setting for SolidUI, you need to set the darkSelector option.
        darkSelector: '[data-kb-theme="dark"]',
      },
      {
        // If you are using reka ui.
        componentLibrary: 'reka',
      },
    ),
  ],

  // By default, `.ts` and `.js` files are NOT extracted.
  // If you want to extract them, use the following configuration.
  // It's necessary to add the following configuration if you use shadcn-vue or shadcn-svelte.
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        '(components|src)/**/*.{js,ts}',
      ],
    },
  },
})
