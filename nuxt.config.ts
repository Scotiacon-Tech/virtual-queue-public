import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true,
    timeline: { enabled: true },
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    'nuxt-security',
    'nuxt-svgo',
    '@nuxtjs/google-fonts',
    'nuxt-api-party',
    'dayjs-nuxt',
    '@vueuse/nuxt',
    'nuxt-qrcode',
    'nuxt-oidc-auth',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

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

  oidc: {
    enabled: true,
    providers: {
      keycloak: {
        audience: 'account',
        baseUrl: 'http://localhost:8080/realms/scotiacon/',
        clientId: 'queues-frontend',
        clientSecret: 'LGtuOw7QEvmVEg6wQkmuwGtHC7vVAvQG', // dev only
        redirectUri: 'http://localhost:3000/auth/keycloak/callback',
        exposeAccessToken: true,
      },
    },
  },

  apiParty: {
    server: {
      basePath: '/_proxy/'
    },
    endpoints: {
      queuesBackend: {
        url:  'http://localhost:8000',
        schema: 'openapi/backend.spec.yaml',
        cookies: true
      }
    },
    openAPITS: {
      defaultNonNullable: true,
      immutable: true,
    }
  },

  security: {
    hidePoweredBy: true,
    sri: true,
  },
  routeRules: {
    '/**': {
      security: {
        headers: {
          permissionsPolicy: {
            'camera': ['self']
          },
          contentSecurityPolicy: {
            'script-src': [
              "'self'",  // Fallback value, will be ignored by most modern browsers (level 3)
              "https:", // Fallback value, will be ignored by most modern browsers (level 3)
              "'unsafe-inline'", // Fallback value, will be ignored by almost any browser (level 2)
              "'strict-dynamic'", // Strict CSP via 'strict-dynamic', supported by most modern browsers (level 3)
              "'nonce-{{nonce}}'", // Enables CSP nonce support for scripts in SSR mode, supported by almost any browser (level 2)
              // nuxt-qrcode
              "'unsafe-eval'",
              "https://fastly.jsdelivr.net/npm/zxing-wasm@1.1.3/dist/reader/zxing_reader.wasm"
            ]
          }
        },
      }
    },
    '/manage/tickets/scan/event/**': {
      ssr: false,
      security: {
        headers: {
        }
      }
    }
  },

  svgo: {

  },

  qrcode: {
    options: {
      radius: 1,
      blackColor: 'currentColor',
      whiteColor: 'transparent',
    },
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