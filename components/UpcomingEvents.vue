<script setup lang="ts">
import {useEventDataUpcoming} from "~/composables/api/events";

const {data, error} = await useEventDataUpcoming(3)
const events = computed(() => {
  if (data.value) {
    return data.value.data;
  } else {
    return [];
  }
})
</script>

<template>
  <h2 class="mt-4 mb-3">Upcoming events (next 3 days)</h2>
  <div v-if="events.length > 0" role="list" class="d-flex flex-column ga-4 mb-4">
    <EventSummaryCard
        v-for="event in events"
        role="listitem"
        :id="event.id"
        :title="event.name"
        :open-time="event.startTime"
        :close-time="event.endTime"
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"
    />
  </div>
  <v-alert
      v-else-if="error"
      type="error"
  >
    <v-alert-title>Oh no!</v-alert-title>
    <p>We were unable to load the latest events. Reason: {{ error.statusMessage }}</p>
  </v-alert>
  <p v-else class="mb-4">Ain't nobody here but us chickens. 🐔</p>
  <v-btn to="/events">See all events</v-btn>
</template>

<style scoped>

</style>