<script setup lang="ts">
definePageMeta({
  title: `My settings`
})
useHead({
  title: `My settings`
})
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
          <h2>Notifications</h2>
          <p>Be notified when any of your tickets are available to use. This will require permissions for notifications
            and push notifications.</p>
          <NotificationsSwitch/>
        </v-sheet>
      </ClientOnly>
    </v-container>
  </v-main>
</template>

<style scoped>

</style>