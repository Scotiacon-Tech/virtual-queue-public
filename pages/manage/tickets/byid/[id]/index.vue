<script setup lang="ts">

import {useGetTicketById} from "~/composables/api/events";

definePageMeta({
  title: `Manage ticket`,
})
useHead({
  title: `Manage ticket`
})
requireAppPermissions(['canManageTickets', 'canViewTicket'])

const dayjs = useDayjs();
const route = useRoute();
let id = route.params.id as string

const {data, error} = await useGetTicketById(id, {includeEvent: true})


const copyIdText = ref<string>("Copy");
async function copyIdToClipboard() {
  await navigator.clipboard.writeText(id)
  copyIdText.value = "Copied!"
}
</script>

<template>
  <v-main>
    <v-container>
      <v-sheet v-if="data" class="pa-5" rounded elevation="8">
        <v-table >
          <tbody>
          <tr>
            <th class="row-head pl-1">ID</th>
            <td class="py-1">
              <span class="ticket-id mr-1">{{ data.id }}</span>

              <v-btn
                  class="my-1"
                  append-icon="mdi-clipboard"
                  size="x-small"
                  @click="copyIdToClipboard()"
              >
                {{ copyIdText }}
              </v-btn>
            </td>
          </tr>
          <tr>
            <th class="row-head pl-1">Event</th>
            <td class="py-1">
              <span class="mr-1">{{ data.event!.name }}</span>

            </td>
          </tr>
          <tr>
            <th class="row-head pl-1">Ticket Number</th>
            <td class="py-1">{{ data.name }}</td>
          </tr>
          <tr>
            <th class="row-head pl-1">Owner</th>
            <td class="py-1">{{ data.owner }}</td>
          </tr>
          <tr>
            <th class="row-head pl-1">Status</th>
            <td class="py-1">{{ data.stateDescription }}</td>
          </tr>
          </tbody>
        </v-table>


        <div class="d-flex justify-center align-center">
          <TicketView qr-code :ticket="data" />
        </div>

        <v-btn
            class="my-4"
            block
            :to="`/manage/events/byid/${data.eventId}`"
        >
          Go to event
        </v-btn>
        <v-btn
            class="my-4"
            block
            color="red"
            :disabled="data.state === 'Revoked'"
        >
          Revoke
        </v-btn>
      </v-sheet>
    </v-container>
  </v-main>
</template>

<style scoped>
.row-head {
  width: 120px;
  max-width: 120px;
}
.ticket-id {
  max-height: 1lh;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>