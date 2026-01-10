<script setup lang="ts">
import {useEventDataUpcoming} from "~/composables/api/events";
import dayjs from "dayjs";

const now = dayjs();
const start = now.startOf('day').add(3, 'day')
const {data, error, pending} = useEventDataUpcoming(start, now)

</script>

<template>
  <ClientOnly>
    <h2 class="mt-4 mb-3">Upcoming events (next 3 days)</h2>
    <div v-if="!data && pending" role="presentation" class="d-flex flex-column ga-4 mb-4" >
      <EventSummaryCardSkeleton />
    </div>
    <div v-else-if="data && data.data.length > 0" role="list" class="d-flex flex-column ga-4 mb-4">
      <EventSummaryCard
          v-for="event in data.data"
          :id="event.id"
          :key="event.id"
          role="listitem"
          :title="event.name"
          :open-time="event.startTime"
          :close-time="event.endTime"
          :description="event.description"
      />
    </div>
    <v-alert
        v-else-if="error !== undefined"
        type="error"
    >
      <v-alert-title>Oh no!</v-alert-title>
      <p>We were unable to load the latest events. Reason: {{ error }}</p>
    </v-alert>
    <p v-else class="mb-4">Ain't nobody here but us chickens. 🐔</p>
  </ClientOnly>
  <v-btn block to="/events">See all events</v-btn>
</template>

<style scoped>

</style>