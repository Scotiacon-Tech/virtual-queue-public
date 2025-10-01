<script setup lang="ts">
import {useMyActiveTickets} from "~/composables/api/events";

const {data, error} = useMyActiveTickets()
const tickets = computed(() => {
  if (data.value) {
    return data.value.data;
  } else {
    return [];
  }
})

</script>

<template>
  <h2 v-if="data" class="mt-2 mb-3">
    Active Tickets
    <span v-if="data">({{ data.totalItems }})</span>
  </h2>
  <div v-if="tickets.length > 0" role="list" class="d-flex flex-column ga-4">
      <TicketSummaryCard
          v-for="ticket in tickets"
          role="listitem"
          :id="ticket.id"
          :title="ticket.event.name"
          :description="ticket.stateDescription"
      />
  </div>
  <div v-else class="mt-2">
    Nothing active for now.
  </div>
  <v-btn v-if="data" to="/my/tickets" class="mt-4">See my tickets</v-btn>
</template>

<style scoped>

</style>