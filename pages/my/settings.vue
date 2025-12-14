<script setup lang="ts">

const app = useNuxtApp()

definePageMeta({
  title: `My settings`
})
useHead({
  title: `My settings`
})

const isPWAInstalled = ref<boolean>(false)
const showInstallButton = ref<boolean>(false)

onMounted(() => {
  if (import.meta.client) {
    isPWAInstalled.value = app.$pwa?.isPWAInstalled ?? false

    // Also check on mount
    showInstallButton.value = app.$pwa?.showInstallPrompt ?? false
  }
})

async function triggerInstall() {
  if (app.$pwa && app.$pwa.install) {
    try {
      await app.$pwa.install()
      showInstallButton.value = false
    } catch (e) {
      console.error('Error triggering install prompt:', e)
    }
  }
}
</script>

<template>
  <v-main>
    <v-container>
      <ClientOnly>
        <v-sheet
            rounded
            elevation="8"
            class="mt-4 pa-5"
        >
          <v-alert
              v-if="showInstallButton && !isPWAInstalled"
              class="mb-2"
              type="info"
              variant="outlined"
              border
              title="App not installed"
              text="Some feature will not be available until the app is installed on your device."
          ></v-alert>
          <v-alert
              v-if="!isPWAInstalled"
              class="mb-2"
              type="info"
              variant="outlined"
              border
              title="You are not using the app"
              text="Some feature will not be available since you are not in the app."
          ></v-alert>
          <v-btn
              v-if="showInstallButton"
              class="mb-2"
              block
              @click="triggerInstall"
          >
            Install
          </v-btn>

          <h2>Notifications</h2>
          <p>Be notified when any of your tickets are available to use. This will require permissions for notifications
            and periodic background sync.</p>
          <p class="mt-2">This will periodically use your data connection.</p>
          <NotificationsSwitch/>
        </v-sheet>
      </ClientOnly>
    </v-container>
  </v-main>
</template>

<style scoped>

</style>