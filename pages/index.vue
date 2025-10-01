<script setup lang="ts">
import {useEventDataUpcoming} from "~/composables/api/events";
import UpcomingEvents from "~/components/UpcomingEvents.vue";

definePageMeta({
  title: `Queues`,
})
useHead({
  title: `Queues`
})
onMounted(() => {
  requireAppPermissions([
    'canDoSomething'
  ])
})
const canListEvents = hasAppPermissions(['canListEvents'])
const canListTickets = hasAppPermissions(['canListTickets'])

</script>

<template>
  <v-main>
    <v-container>
      <v-sheet class="pa-5" rounded elevation="8">
        <v-row justify="center" align="center" no-gutters class="mb-12">
          <v-col cols="6" class="text-center logo">
            <svgo-virtual-queues-logo title="Virtual Queues" filled="false" style="width: 100%; height: auto; max-height: 150px;"/>
            <h1>Queues</h1>
          </v-col>
        </v-row>

        <ActiveTickets v-if="canListTickets"/>
        <v-divider class="my-6"></v-divider>
        <UpcomingEvents v-if="canListEvents" />
      </v-sheet>
    </v-container>
  </v-main>
</template>

<style scoped>
  h1 {
    font-family: "Outfit", Helvetica, Arial, sans-serif;
    font-size: 3rem;
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: normal;
  }
  .logo svg {
    color: rgb(var(--v-theme-primary));
  }
  .logo h1 {
    color: rgb(var(--v-theme-primary));
  }
</style>