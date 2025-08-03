<script setup lang="ts">
import AppNavigationDrawer from "~/components/AppNavigationDrawer.vue";

const drawer = ref<boolean>(false)
</script>

<template>
  <v-app>

      <v-app-bar density="comfortable">
        <v-app-bar-nav-icon @click="drawer = !drawer" />

        <v-app-bar-title>Queues</v-app-bar-title>

        <v-btn icon>
          <v-badge dot>
            <v-icon>mdi-ticket</v-icon>
          </v-badge>
        </v-btn>
      </v-app-bar>

      <AppNavigationDrawer
          v-model="drawer"
      />

      <slot/>


    <v-footer class="text-center d-flex flex-column ga-2 py-4">
      <div class="text-caption font-weight-regular opacity-60">
        Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet.
        Mauris cursus commodo interdum. Praesent ut risus eget metus luctus
        accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim
        a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula
        lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus
        iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor
        vel ut orci. Orci varius natoque penatibus et magnis dis parturient montes,
        nascetur ridiculus mus.
      </div>

      <div>
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </div>
    </v-footer>
  </v-app>
</template>

<style scoped>

</style>