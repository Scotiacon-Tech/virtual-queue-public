<script setup lang="ts">
import TicketView from "~/components/TicketView.vue";
import {useTicketOps} from "~/composables/tickets";
import type {TicketState} from "~/composables/api/events";

const {
  holdTicket,
  holdTicketBusy,
  rejoinTicket,
  rejoinTicketBusy
} = useTicketOps()

const {ticket = undefined} = defineProps<{
  ticket?: {
    readonly id: string
    readonly name: string
    event: {
      readonly name: string
    } | undefined
    readonly state: TicketState
    readonly heldAtPosition?: number
    readonly expires?: string
  }
}>()
const emit = defineEmits<{
  refresh: [id: string]
}>()
</script>

<template>
  <v-sheet
      v-if="ticket"
      class="mt-4 pa-5 d-flex flex-column ga-md-8 justify-space-between"
      rounded
      elevation="8"
  >
    <div class="d-flex justify-center mb-6">
      <TicketView :ticket="ticket" qr-code />
    </div>
    <div>
      <h2 class="text-h6 mb-2">Actions</h2>
      <v-btn v-if="ticket.state == 'Requested'" :loading="holdTicketBusy" @click="() => {holdTicket(ticket.id); emit('refresh', ticket.id)}">
        Hold My Place
      </v-btn>
      <v-btn v-if="ticket.state == 'OnHold'" :loading="rejoinTicketBusy" @click="() => {rejoinTicket(ticket.id); emit('refresh', ticket.id)}">
        Rejoin queue
      </v-btn>
    </div>
  </v-sheet>
</template>