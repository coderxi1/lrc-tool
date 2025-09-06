// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/icon',
    '@unocss/nuxt',
    '@pinia/nuxt'
  ],
  icon: { 
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
    localApiEndpoint: '/nuxt-icon',
  },
  css: [
    '@unocss/reset/tailwind.css',
    "~/assets/main.scss",
  ],
  app: {
    head: {
      title: 'LRC Tool',
      meta: [
        { name: 'description', content: '云音乐歌词下载处理工具, 支持网易云音乐、QQ音乐歌词' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  
})
