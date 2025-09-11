<script setup lang="ts">
import {useEventDataUpcoming} from "~/composables/api/events";
const {data, error} = await useEventDataUpcoming(3)
</script>

<template>
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
</template>

<style scoped>

</style>