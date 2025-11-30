<script setup lang="ts">

import {fetchDeleteTicket, fetchUpdateTicket, useGetTicketById} from "~/composables/api/events";

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

const {data, refresh, error} = await useGetTicketById(id, {includeEvent: true})


const copyIdText = ref<string>("Copy");
async function copyIdToClipboard() {
  await navigator.clipboard.writeText(id)
  copyIdText.value = "Copied!"
}


const busyActivating = ref<boolean>(false)

async function activate(id: string) {
  try {
    busyActivating.value = true;
    await fetchUpdateTicket(id, {state: 'Active'})
    await refresh()
  } catch (error) {
    console.error("Error Activating", error)
  } finally {
    busyActivating.value = false;
  }
}

const busyCheckingIn = ref<boolean>(false)

async function checkIn(id: string) {
  try {
    busyCheckingIn.value = true;
    await fetchUpdateTicket(id, {state: 'CheckedIn'})
    await refresh()
  } catch (error) {
    console.error("Error Activating", error)
  } finally {
    busyCheckingIn.value = false;
  }
}

const busyConsuming = ref<boolean>(false)

async function consume(id: string) {
  try {
    busyConsuming.value = true;
    await fetchUpdateTicket(id, {state: 'Consumed'})
    await refresh()
  } catch (error) {
    console.error("Error Activating", error)
  } finally {
    busyConsuming.value = false;
  }
}

const revokeDialog = ref(false)
async function revokeDialogConfirm() {
  try {
    await fetchDeleteTicket(id)
    await refresh()
  } catch (error) {
    console.error('Could not revoke ticket', error)
  } finally {
    revokeDialog.value = false
  }
}
function revokeDialogCancel() {
  revokeDialog.value = false
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

              <v-btn
                  class="my-1"
                  size="x-small"
                  :to="`/manage/events/byid/${data.eventId}`"
              >
                Go to
              </v-btn>
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
          <tr v-if="data.state === 'Active'">
            <th class="row-head pl-1">Expires at</th>
            <td v-if="data.expires" class="py-1">{{ dayjs(data.expires).format('LLL')}}</td>
            <td v-else class="py-1">Never</td>
          </tr>
          </tbody>
        </v-table>


        <div class="d-flex justify-center align-center">
          <TicketView qr-code :ticket="data" />
        </div>

        <v-btn
            class="my-4"
            block
            :loading="busyActivating"
            :disabled="data.state !== 'Requested'"
            @click="() => activate(id)"
        >
          Activate
        </v-btn>
        <v-btn
            class="my-4"
            block
            :loading="busyCheckingIn"
            :disabled="data.state !== 'Active'"
            @click="() => checkIn(id)"
        >
          Check In
        </v-btn>
        <v-btn
            class="my-4"
            block
            :loading="busyConsuming"
            :disabled="data.state !== 'Consumed'"
            @click="() => consume(id)"
        >
          Consume
        </v-btn>
        <v-btn
          class="my-4"
          block
          :disabled="data.state !== 'Active' || (data.state === 'Active' && !data.expires)"
        >
          Set Expiry to Now + 1 Hour
        </v-btn>
        <v-btn
            class="my-4"
            block
            color="red"
            :disabled="data.state === 'Revoked'"
            @click="revokeDialog = true"
        >
          Revoke
        </v-btn>
        <!-- Revoke dialog -->
        <v-dialog v-model="revokeDialog" max-width="600">
          <v-card
              title="Revoke ticket"
              :subtitle="`Do you want to revoke the ticket for ${data!.owner}?`"
          >
            <template v-slot:text>
              <div class="d-flex flex-column ga-4">
                <p>
                  This will make this ticket unusable. Another ticket can be requested.
                </p>
              </div>
            </template>

            <v-card-actions class="bg-surface-light">
              <v-btn text="Cancel" @click="revokeDialogCancel"></v-btn>
              <v-spacer></v-spacer>
              <v-btn text="Revoke" color="red" variant="elevated" @click="revokeDialogConfirm"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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