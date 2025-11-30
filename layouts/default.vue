<script setup lang="ts">
import AppNavigationDrawer from "~/components/AppNavigationDrawer.vue";
import type {RouteLocation} from "#vue-router";

const drawer = ref<boolean>(false)

const r = useRoute()
const getTitle = (route: RouteLocation) => (route.meta.title as (string | undefined)) || route.path
const title = ref<string>(getTitle(r));
watch(r, (newRoute) => {
  title.value = getTitle(newRoute)
})
</script>

<template>
  <v-app class="app">

      <v-app-bar density="comfortable" class="app-bar">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-app-bar-title tag="h1">{{ title }}</v-app-bar-title>
      </v-app-bar>

      <AppNavigationDrawer
          v-model="drawer"
      />

    <slot />

    <v-footer class="app-footer text-center d-flex flex-column ga-2 py-4 bg-transparent">
      <!--<div class="text-caption font-weight-regular opacity-60">-->
      <!--</div>-->

      <div>
        {{ new Date().getFullYear() }} — <strong>Scotiacon</strong>
      </div>
    </v-footer>
  </v-app>
</template>

<style scoped>
.app {
  background-image: var(--v-app-background) !important;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
}
.app-bar {
  color: rgb(var(--v-theme-app-bar-color)) !important;
  background-color: rgb(var(--v-theme-app-bar-background-color)) !important;
}
.app-footer {
  color: rgb(var(--v-theme-app-footer-color)) !important;
}
</style>