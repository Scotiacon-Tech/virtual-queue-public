// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import {createVuetify, type ThemeDefinition} from 'vuetify'
import { md1 } from 'vuetify/blueprints'

import colors from 'vuetify/util/colors'

const theme: ThemeDefinition = {
    dark: false,
    colors: {
        surface: colors.indigo.darken1,
        onsurface: colors.grey.lighten5,
    }
}

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        // ... your configuration
        blueprint: md1,
        ssr: true,
        // theme: {
        //     themes: {
        //         light: theme
        //     }
        // }
    })
    app.vueApp.use(vuetify)
})
