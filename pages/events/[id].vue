<script setup lang="ts">
import {
  fetchCreateTicket, fetchUpdateTicket,
  useGetAllOpenTicketsForEvent,
  useGetEventById,
} from "~/composables/api/events";
import TicketView from "~/components/TicketView.vue";
import {useTicketOps} from "~/composables/tickets";


definePageMeta({
  title: `Events`
})
useHead({
  title: `Events`
})

const dayjs = useDayjs();

const route = useRoute();
let id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const {data: eventData, error: eventError} = await useGetEventById(id)
// TODO Not found error

const {
  data: ticketsData,
  error: ticketsError,
  refresh: ticketsRefresh,
  clear: ticketsClear
} = await useGetAllOpenTicketsForEvent(id, {cache: false})

const { newTicketBusy, holdTicketBusy, rejoinTicketBusy ,...ticketOps} = useTicketOps(id)
async function newTicket() {
  if (await ticketOps.newTicket()) {
    await ticketsRefresh()
  }
}

async function holdTicket(id: string) {
  if (await ticketOps.holdTicket(id)) {
    await ticketsRefresh()
  }
}
async function rejoinTicket(id: string) {
  if (await ticketOps.rejoinTicket(id)) {
    await ticketsRefresh()
  }
}

</script>

<template>
  <v-main>
    <v-container>
      <v-sheet v-if="eventData" class="pa-5" rounded elevation="8">
        <h1 class="header text-h4 mb-2">{{ eventData.data.name }}</h1>
        <p class="my-3">{{ eventData.data.description }}</p>
        <p>Opens: {{ dayjs(eventData.data.startTime).format('LLL')}}</p>
        <p>Closes: {{ dayjs(eventData.data.endTime).format('LLL')}}</p>

        <v-divider class="my-6"></v-divider>

        <div
            aria-label="Your tickets"
            role="list"
            class="d-flex flex-column ga-4"
            >
          <TicketSummaryCard
              v-if="ticketsData"
              v-for="t in ticketsData.data"
              role="listitem"
              class="ma-0"
              :id="t.id"
              :title="t.event.name"
              :description="t.stateDescription"
          >
            <template v-slot:actions>
              <v-btn v-if="t.state == 'Requested'" @click="holdTicket(t.id)" :loading="holdTicketBusy" variant="elevated">Hold my place</v-btn>
              <v-btn v-if="t.state == 'OnHold'" @click="rejoinTicket(t.id)" :loading="rejoinTicketBusy" variant="elevated">Rejoin queue</v-btn>
            </template>
          </TicketSummaryCard>
        </div>
        <v-btn
            block
            class="mt-4"
            :disabled="(ticketsData?.totalItems ?? 0) > 0"
            :loading="newTicketBusy"
            @click="newTicket"
        >
          Get a ticket
        </v-btn>
      </v-sheet>
    </v-container>
  </v-main>
</template>

<style scoped>
.header {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;

  max-height: 2lh;
}
</style>