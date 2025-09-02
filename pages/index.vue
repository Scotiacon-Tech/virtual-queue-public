<script setup lang="ts">
import {useEventDataUpcoming} from "~/composables/api/events";

definePageMeta({
  title: `Queues`
})
useHead({
  title: `Queues`
})

const {data, error} = await useEventDataUpcoming(3)
</script>

<template>
  <v-main>
    <v-container>
      <v-sheet>
        <v-row justify="center" align="center" no-gutters class="mb-12">
          <v-col cols="6" class="text-center">
            <svgo-virtual-queues-logo title="Virtual Queues" filled="false" style="width: 100%; height: auto; max-height: 150px;"/>
            <h1>Queues</h1>
          </v-col>
        </v-row>
      </v-sheet>

      <h2 class="text-h6 mb-3">Upcoming events (next 3 days)</h2>
      <v-row dense>
        <v-col v-if="data && data.data.length > 0" role="list" cols="12">
            <EventSummaryCard
                v-for="event in data.data"
                :id="event.id"
                :title="event.name"
                :open-time="event.startTime"
                :close-time="event.endTime"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"
            />
        </v-col>
        <v-col v-else-if="error">
          <v-alert
              type="error"
          >
            <v-alert-title>Oh no!</v-alert-title>
            <p>We were unable to load the latest events. Reason: {{ error.statusMessage }}</p>
          </v-alert>
        </v-col>
        <v-col v-else>
          <p>Ain't nobody here but us chickens.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn to="/events">See all events</v-btn>
        </v-col>
      </v-row>
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
</style>