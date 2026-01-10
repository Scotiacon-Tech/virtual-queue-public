// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import {createVuetify, type ThemeDefinition} from 'vuetify'
import { md1 } from 'vuetify/blueprints'

import {VPie} from "vuetify/labs/VPie";

const scotiacon2026: ThemeDefinition = {dark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        'surface-bright': '#FFFFFF',
        'surface-light': '#EEEEEE',
        'surface-variant': '#efea1a',
        'on-surface-variant': '#EEEEEE',
        primary: '#f3900a', // This will fail WCAG AA
        'primary-darken-1': '#8e5107',
        secondary: '#48A9A6',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
        // Custom colors
        'app-bar-background-color': '#CF5B21',
        'app-bar-color': '#FFF',
        'app-footer-color': '#FFF',
    },
    variables: {
        'border-color': '#000000',
        'border-opacity': 0.12,
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.60,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.04,
        'hover-opacity': 0.04,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.12,
        'dragged-opacity': 0.08,
        'theme-kbd': '#212529',
        'theme-on-kbd': '#FFFFFF',
        'theme-code': '#F5F5F5',
        'theme-on-code': '#000000',
        // Custom variables
        'app-background': 'url("/theme/scotiacon2026/background.avif")',
    }
}
const scotiacon2026Dark: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        'surface-bright': '#FFFFFF',
        'surface-light': '#EEEEEE',
        'surface-variant': '#424242',
        'on-surface-variant': '#EEEEEE',
        primary: '#f3900a', // This will fail WCAG AA
        'primary-darken-1': '#8e5107',
        secondary: '#48A9A6',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
        // Custom colors
        'app-bar-background-color': '#CF5B21',
        'app-bar-color': '#FFF',
        'app-footer-color': '#FFF',
    },
    variables: {
        'border-color': '#000000',
        'border-opacity': 0.12,
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.60,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.04,
        'hover-opacity': 0.04,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.12,
        'dragged-opacity': 0.08,
        'theme-kbd': '#212529',
        'theme-on-kbd': '#FFFFFF',
        'theme-code': '#F5F5F5',
        'theme-on-code': '#000000',
        // Custom variables
        'app-background': 'url("/theme/scotiacon2026/background.avif")',
    }
}

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        // ... your configuration
        blueprint: md1,
        ssr: true,
        components: {
            VPie
        },
        theme: {
            defaultTheme: 'scotiacon2026',
            themes: {
                scotiacon2026,
                scotiacon2026Dark
            }
        }
    })
    app.vueApp.use(vuetify)
})
