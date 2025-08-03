import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true,
    timeline: { enabled: true },
  },

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@sidebase/nuxt-auth',
    'nuxt-security',
    'nuxt-svgo',
    '@nuxtjs/google-fonts',
    'nuxt-api-party',
    'dayjs-nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],

  auth: {
    isEnabled: false,
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: 'http://localhost:3000/api/auth',
    provider: { /* your provider config */ },
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
    }
  },

  apiParty: {
    server: {
      basePath: '/_proxy/'
    },
    endpoints: {
      queuesBackend: {
        url: 'http://localhost:8000',
        schema: 'openapi/backend.spec.yaml',
      }
    },
    openAPITS: {
      defaultNonNullable: true,
      immutable: true,
    }
  },

  security: {
    hidePoweredBy: true,
    sri: true
  },

  svgo: {

  },

  googleFonts: {
    download: true,
    families: {
      Outfit: true
    }
  },

  dayjs: {
    plugins: ['timezone', 'relativeTime', 'localizedFormat', 'customParseFormat', "timezone", 'advancedFormat'],
    locales: ['en'],
    defaultLocale: 'en',
    defaultTimezone: 'Europe/London'
  }
})