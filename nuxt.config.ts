// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap' }
      ]
    }
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost/jastiper-engine/api'
    }
  },
  devServer: {
    port: 8001,
    host: '0.0.0.0'
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/motion'
  ],
  css: [
    'primevue/resources/themes/aura-light-green/theme.css'
  ],
  build: {
    transpile: ['primevue']
  },
  vite: {
    vue: {
      template: {
        compilerOptions: {
          directiveTransforms: {
            motion: () => ({ props: [], needRuntime: false }),
            'motion-hover': () => ({ props: [], needRuntime: false }),
            'motion-slide-visible-once': () => ({ props: [], needRuntime: false }),
            'motion-pop-visible-once': () => ({ props: [], needRuntime: false })
          }
        }
      }
    }
  }
})
