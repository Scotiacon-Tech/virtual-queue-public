<script setup lang="ts">
import {useNotifications} from "~/composables/useNotifications";

const {available, enable, disable, isEnabled} = useNotifications()

const isAvailable = ref<boolean>(false);
const enabled = ref<boolean>(false);
onMounted(async () => {
  if (import.meta.client) {
    const r = await navigator.serviceWorker.ready
    r.addEventListener('statechange', (e) => {
      available().then(value => {
        console.log("@@@@");
        isAvailable.value = value;
      })
    })
    isAvailable.value = await available();
    enabled.value = await isEnabled();
  }
})
</script>

<template>
  <v-switch
      v-model="enabled"
      :disabled="!isAvailable"
      color="primary"
      :label="`Notifications: ${enabled ? 'Enabled' : 'Disabled'}`"
      @update:modelValue="(value) => {
        if (value) {
          enable()
        } else {
          disable()
        }
      }"

  ></v-switch>
</template>

<style scoped>

</style>