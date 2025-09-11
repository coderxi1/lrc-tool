import type { Theme } from 'unocss/preset-uno'
import { presetWind3 } from 'unocss'
import presetTheme from 'unocss-preset-theme'
import { defineConfig } from 'unocss'

export const lightTheme = {
  colors: {
    maincolor: '#39C5BB'
  }
} satisfies Theme

export const darkTheme = {
  colors: {
    
  }
} satisfies Theme

export default defineConfig({
  theme: {
    ...lightTheme
  },
  presets: [
    presetWind3(),
    presetTheme<Theme>({ theme: { dark: darkTheme} })
  ],
  shortcuts: {
    'full': 'w-full h-full',
    'hoverbg': 'hover:bg-black/5 dark:hover:bg-white/10 outline-0 transition-colors duration-300',
    'btn-circle' : 'w-10 h-10 flex items-center justify-center rounded-full hoverbg'
  },
  rules: [
    ['text-dark', { color: '#4c4948' }],
    ['text-light', { color: '#c9c9d7' }],
    [/^bgi-\[([\w\W]+)\]$/, ([, value]) => ({'background-image': `${value}` })],
  ]
})