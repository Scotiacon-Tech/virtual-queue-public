<script setup lang="ts">
import {
  fetchCreateTicket, fetchUpdateTicket, type TicketState,
  useGetAllOpenTicketsForEvent,
  useGetEventById,
} from "~/composables/api/events";
import TicketView from "~/components/TicketView.vue";

definePageMeta({
  title: `Events`
})
useHead({
  title: `Events`
})

const route = useRoute();
let id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const {data: eventData, error: eventError} = await useGetEventById(id)


const {data: ticketsData, error: ticketsError, refresh: ticketsRefresh, clear: ticketsClear}  = await useGetAllOpenTicketsForEvent(id, {cache: false})

const busyGettingATicket = ref(false);
async function getATicket() {
  const eventId = eventData.value?.data.id
  // Assume we always have one queue
  if (eventId) {
    console.log("Getting a new ticket", {eventId});
    try {
      busyGettingATicket.value = true
      await fetchCreateTicket(eventId)
      await ticketsRefresh({cause: "refresh:manual"})
    } catch (error) {
      console.error("An error occurred trying to create a new ticket", error);
    } finally {
      busyGettingATicket.value = false
    }
  } else {
    console.error("No queue found for event");
  }
}

const busyHolding = ref<boolean>(false)
async function hold(id: string) {
  try {
    console.log("Holding ticket", {id})
    busyHolding.value = true;
    await fetchUpdateTicket(id, {state: "OnHold"})
    console.log("Refreshing tickets");
    await ticketsRefresh()
  } catch (error) {
    console.error("Error holding ticket", error)
  } finally {
    busyHolding.value = false;
  }
}

const busyRejoin = ref<boolean>(false)
async function rejoin(id: string) {
  try {
    console.log("Rejoining queue", {id})
    busyRejoin.value = true;
    await fetchUpdateTicket(id, {state: "Requested"})
    console.log("Refreshing tickets");
    await ticketsRefresh()
  } catch (error) {
    console.error("Error rejoining", error)
  } finally {
    busyRejoin.value = false;
  }
}
</script>

<template>
  <v-main>
    <v-container v-if="eventError">
      <v-col>
        <v-alert
            type="error"
        >
          <v-alert-title>Oh no!</v-alert-title>
          <p>We were unable to load all the events. Reason: {{ eventError.statusMessage }}</p>
        </v-alert>
      </v-col>
    </v-container>
    <v-container v-else>
      <h1 class="header text-h4 mb-2">{{ eventData!.data.name }}</h1>

      <v-img
          class="bg-grey-lighten-2"
          height="125"
          src="https://picsum.photos/350/165?random"
          cover/>
      <p class="my-3">{{eventData?.data.description}}</p>
      <v-divider class="my-6"></v-divider>
      <v-btn block :loading="busyGettingATicket" @click="getATicket">Get a ticket</v-btn>
      <v-row
          v-if="ticketsData"
          v-for="t in ticketsData.data"

          class="my-0 mx-2 justify-center"
      >
        <TicketView :ticket="t" :event-name="eventData!.data.name" qr-code>
          <template v-slot:actions>
              <v-btn v-if="t.state == 'Requested'" block variant="outlined" :loading="busyHolding" @click="() => hold(t.id)">Hold My Place</v-btn>
              <v-btn v-if="t.state == 'OnHold'" block variant="outlined" :loading="busyRejoin" @click="() => rejoin(t.id)">Rejoin queue</v-btn>
          </template>
        </TicketView>
      </v-row>
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