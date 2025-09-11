export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode'
  ],
  icon: { 
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
    aliases: {
      'theme-system': 'mdi:brightness-auto',
      'theme-light': 'mdi:white-balance-sunny',
      'theme-dark': 'mdi:weather-night',
    },
    localApiEndpoint: '/nuxt-icon',
  },
  colorMode: {
    classSuffix: '',
    storageKey: 'theme'
  },
  css: [
    '@unocss/reset/tailwind.css',
    'vue-final-modal/style.css',
    '~/assets/main.scss',
  ],
  app: {
    head: {
      title: 'LRC Tool',
      meta: [
        { name: 'description', content: '云音乐歌词下载处理工具, 支持网易云音乐、QQ音乐歌词' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ]
    },
  },
  plugins: [
    '~/plugins/vue-final-modal.ts'
  ]
})