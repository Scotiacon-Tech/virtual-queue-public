import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import dotenv from 'dotenv'
import path from 'path'

// Determine which .env file to load
const envFile =
    process.env.NODE_ENV === 'development'
        ? '.env.development'
        : '.env.production'

// Load the relevant .env file
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
    timeline: { enabled: process.env.NODE_ENV === 'development' },
  },
  debug: process.env.NODE_ENV === 'development',

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    'nuxt-security',
    'nuxt-svgo',
    'nuxt-api-party',
    'dayjs-nuxt',
    '@vueuse/nuxt',
    'nuxt-qrcode',
    'nuxt-oidc-auth',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@vite-pwa/nuxt'
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

  pwa: {
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Scotiacon Queues',
      short_name: 'ScotiaQueues',
      theme_color: '#f3900a',
      display: 'minimal-ui',
      start_url: '',
      icons: [ // TODO
        {
          src: '/logos/192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: '/logos/512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },

    workbox: {
      globPatterns: ['**/*.{js,css,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

  oidc: {
    enabled: true,
    providers: {
      oidc: {
        clientId: '', // Set in NUXT_OIDC_PROVIDERS_OIDC_CLIENT_ID
        clientSecret: '', // Set in NUXT_OIDC_PROVIDERS_OIDC_CLIENT_SECRET
        responseType: 'code token',
        authenticationScheme: 'body',
        validateAccessToken: true,
        validateIdToken: false,
        skipAccessTokenParsing: true,
        state: true,
        nonce: true,
        pkce: true,
        tokenRequestType: 'form-urlencoded',
        scope: ['openid', 'email', 'profile', 'convention_references'],
        authorizationUrl: process.env.NUXT_OIDC_PROVIDERS_OIDC_AUTHORIZATION_URL || 'https://auth.scotiacon.org.uk/connect/auth',
        tokenUrl: process.env.NUXT_OIDC_PROVIDERS_OIDC_TOKEN_URL || 'https://auth-api.scotiacon.org.uk/connect/token',
        userInfoUrl: process.env.NUXT_OIDC_PROVIDERS_OIDC_USERINFO_URL || 'https://auth-api.scotiacon.org.uk/connect/userinfo',
        logoutUrl: process.env.NUXT_OIDC_PROVIDERS_OIDC_LOGOUT_URL || `https://auth.scotiacon.org.uk/connect/logout?post_logout_redirect_uri=${process.env.NUXT_OIDC_PROVIDERS_OIDC_LOGOUT_REDIRECT_URI || 'http://localhost:3000/'}`,
        redirectUri: process.env.NUXT_OIDC_PROVIDERS_OIDC_REDIRECT_URI || 'http://localhost:3000/auth/oidc/callback',
        exposeAccessToken: true,
        userNameClaim: 'preferred_username',
        sessionConfiguration: {
          expirationCheck: true,
          automaticRefresh: true,
          expirationThreshold: 240
        }
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
        cookies: false
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
            'camera': ['self'],
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

  dayjs: {
    plugins: ['timezone', 'relativeTime', 'localizedFormat', 'customParseFormat', "timezone", 'advancedFormat'],
    locales: ['en'],
    defaultLocale: 'en',
    defaultTimezone: 'Europe/London'
  }
})
