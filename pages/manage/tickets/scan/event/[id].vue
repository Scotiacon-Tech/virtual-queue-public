<script setup lang="ts">
import {useGetEventById} from "~/composables/api/events";

definePageMeta({
  title: `Scan tickets`
})
useHead({
  title: `Scan tickets`
})

const route = useRoute();
let eventId = route.params.id as string

const {data: eventData, error: eventError} = useGetEventById(eventId)
</script>

<template>
  <v-main>
    <TicketScan v-if="eventData" :event-id="eventId" :event-name="eventData.data.name" />
  </v-main>
</template>

<style scoped>

</style>