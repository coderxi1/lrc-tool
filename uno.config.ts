import type { Theme } from 'unocss/preset-uno'
import { presetWind3 } from 'unocss'
import presetTheme from 'unocss-preset-theme'
import { defineConfig } from 'unocss'

export const lightTheme = {
  colors: {
    global: '#f0f2f4',
  },
} satisfies Theme

export const darkTheme = {
  colors: {
    global: '#191919',
  }
} satisfies Theme

export default defineConfig({
  theme: {
    ...lightTheme
  },
  presets: [
    presetWind3({preflight: false}),
    presetTheme<Theme>({ theme: { dark: darkTheme} })
  ],
  shortcuts: {
    'full': 'w-full h-full'
  },
})