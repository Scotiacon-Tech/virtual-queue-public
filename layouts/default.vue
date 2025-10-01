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
  <div class="page-ribbon">
    <p  role="presentation">PROTOTYPE &mdash; Scotiacon Confidential &mdash; PROTOTYPE</p>
  </div>
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

.page-ribbon {
  position: fixed;
  display: block;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 9999;

  overflow: hidden;
  height: 1lh;

  background: rgba(0,0,0, 50%);
}

.page-ribbon > p {
  text-align: center;
  font-weight: 600;
  padding: 0.1em;

  background: linear-gradient(
      90deg,
      rgba(255, 0, 0, 1) 0%,
      rgba(255, 154, 0, 1) 10%,
      rgba(208, 222, 33, 1) 20%,
      rgba(79, 220, 74, 1) 30%,
      rgba(63, 218, 216, 1) 40%,
      rgba(47, 201, 226, 1) 50%,
      rgba(28, 127, 238, 1) 60%,
      rgba(95, 21, 242, 1) 70%,
      rgba(186, 12, 248, 1) 80%,
      rgba(251, 7, 217, 1) 90%,
      rgba(255, 0, 0, 1) 100%
  );
  background-size: 400% 400%;
  background-clip: text;
  color: transparent;
  text-shadow: none;

  animation: move-prototype-bg 10s linear infinite;
}

@keyframes move-prototype-bg {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>