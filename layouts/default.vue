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

const swNeedsUpdate = ref<boolean>(false)
onMounted(async () => {
  const reg = await navigator.serviceWorker.getRegistration()
  if (reg) {
    if (reg.waiting) {
      swNeedsUpdate.value = true
    }
    reg.addEventListener('updatefound', () => {
      const installing = reg.installing;
      if (installing) {
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed') {
            swNeedsUpdate.value = true
          }
        })
      }
    })
  }
})

async function installWaitingServiceWorker() {
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    if (reg && reg.waiting) {
      reg.waiting.postMessage({type: "SKIP_WAITING"})
    }
  } catch (e) {
    console.error('Unable to update Service Worker', e)
  }
}
</script>

<template>
  <div>
    <div v-if="swNeedsUpdate" class="update-app d-flex justify-center pt-4">
      <v-card class="ma-4 pa-2 text-center flex-grow-1" elevation="20" max-width="800">
        <p class="mb-2">A new version of Queues is available.</p>
        <v-btn color="primary" @click="installWaitingServiceWorker">Update</v-btn>
      </v-card>
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
        <!--<div class="text-caption font-weight-regular opacity-60">-->
        <!--</div>-->

        <div>
          {{ new Date().getFullYear() }} — <strong>Scotiacon</strong>
        </div>
      </v-footer>
    </v-app>
  </div>
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


.update-app {
  position: fixed;
  display: block;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background: linear-gradient(0deg,rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%);

  overflow: hidden;
}
</style>