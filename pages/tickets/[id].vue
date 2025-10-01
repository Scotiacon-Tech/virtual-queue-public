<script setup lang="ts">
import {
  fetchUpdateTicket,
  useGetTicketById,
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
const {data, error, refresh} = await useGetTicketById(id, {includeEvent: true})
// TODO Not found error

const busyHolding = ref<boolean>(false)

async function hold(id: string) {
  try {
    console.log("Holding ticket", {id})
    busyHolding.value = true;
    await fetchUpdateTicket(id, {state: "OnHold"})
    console.log("Refreshing tickets");
    await refresh()
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
    await refresh()
  } catch (error) {
    console.error("Error rejoining", error)
  } finally {
    busyRejoin.value = false;
  }
}
</script>

<template>
  <v-main>
    <v-container>
      <div class="d-flex justify-center">
        <TicketView v-if="data" :ticket="data" qr-code />
      </div>
      <v-sheet
          aria-label="Actions"
          v-if="data && ['Requested', 'OnHold'].includes(data.state)"
          class="mt-4 pa-5"
          rounded
          elevation="8"
      >
        <v-btn v-if="data.state == 'Requested'" block variant="outlined" :loading="busyHolding" @click="() => hold(id)">
          Hold My Place
        </v-btn>
        <v-btn v-if="data.state == 'OnHold'" block variant="outlined" :loading="busyRejoin" @click="() => rejoin(id)">
          Rejoin queue
        </v-btn>
      </v-sheet>
    </v-container>
  </v-main>
</template>

<style scoped>
</style>