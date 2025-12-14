<script setup lang="ts">
import {
  fetchCreateTicket, fetchUpdateTicket,
  useGetAllOpenTicketsForEvent,
  useGetEventById,
} from "~/composables/api/events";
import TicketView from "~/components/TicketView.vue";
import {useTicketOps} from "~/composables/tickets";
import {useSubject} from "~/composables/identity";


definePageMeta({
  title: `Events`
})
useHead({
  title: `Events`
})
requireAppPermissions(['canViewEvent'])

const dayjs = useDayjs();
const subject = useSubject();

const route = useRoute();
let id = (Array.isArray(route.params.id) ? route.params.id[0] : route.params.id) ?? '';
const {data: eventData, error: eventError} = await useGetEventById(id)
// TODO Not found error

const {
  data: ticketsData,
  error: ticketsError,
  refresh: ticketsRefresh,
  clear: ticketsClear
} = await useGetAllOpenTicketsForEvent(id, {owner: subject.value, cache: false})

const busyGettingATicket = ref<boolean>(false);

async function newTicket() {
  if (id) {
    console.log("Getting a new ticket", {id});
    try {
      busyGettingATicket.value = true
      await fetchCreateTicket(id)
      await ticketsRefresh()
      return true;
    } catch (error) {
      console.error("An error occurred trying to create a new ticket", error);
      return false;
    } finally {
      busyGettingATicket.value = false
    }
  }
}

</script>

<template>
  <v-main>
    <v-container>
      <v-sheet v-if="eventData" class="pa-5 mb-5" rounded elevation="8">
        <h1 class="header text-h4 mb-2">{{ eventData.data.name }}</h1>
        <p class="my-3">{{ eventData.data.description }}</p>
        <p>Opens: {{ dayjs(eventData.data.startTime).format('LLL')}}</p>
        <p>Closes: {{ dayjs(eventData.data.endTime).format('LLL')}}</p>
      </v-sheet>

      <div
          v-if="(ticketsData?.totalItems ?? 0) > 0"
          aria-label="Your tickets"
          role="list"
          class="d-flex flex-column ga-4"
          >
        <TicketCard
            v-if="ticketsData"
            v-for="t in ticketsData.data"
            role="listitem"
            class="ma-0"
            :ticket="t"
        />
      </div>
      <v-sheet v-else>
        <v-btn
            block
            class="mt-4"
            v-if="(ticketsData?.totalItems ?? 0) == 0"
            :loading="busyGettingATicket"
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