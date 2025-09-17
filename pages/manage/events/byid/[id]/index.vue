<script setup lang="ts">
import {
  fetchReleaseTickets,
  useGetEventById,
  useGetEventTicketStatistics
} from "~/composables/api/events";
import ApiAlert from "~/components/ApiAlert.vue";
import TicketPie from "~/components/TicketPie.vue";

definePageMeta({
  title: `Manage event`,
})
useHead({
  title: `Manage event`
})
requireAppPermissions(['canManageEvents', 'canViewEvent'])
const canViewEvent = hasAppPermissions(['canViewEvent'])
const canUpdateEvent = hasAppPermissions(['canUpdateEvent'])
const canDeleteEvent = hasAppPermissions(['canDeleteEvent'])
const canViewTicketStats = hasAppPermissions(['canViewTicketStats'])
const canActivateTicket = hasAppPermissions(['canActivateTicket'])

const dayjs = useDayjs();
const route = useRoute();
let id = route.params.id as string

const {data, error} = await useGetEventById(id)

const ticketStats = ref<{ inQueue: number, onHold: number, active: number, used: number } | undefined>()
if (canViewTicketStats) {
  const {data: stats, error: statsError, refresh: refreshStats} = await useGetEventTicketStatistics(id)
  if (stats && stats.value && stats.value.data) {
    const {Requested, OnHold, Active, Consumed} = stats.value.data;
    ticketStats.value = {
      inQueue: Requested || 0,
      onHold: OnHold || 0,
      active: Active || 0,
      used: Consumed || 0,
    }
  } else {
    ticketStats.value = {
      inQueue: 0,
      onHold: 0,
      active: 0,
      used: 0,
    }
  }
}

const deleteDialog = ref<boolean>(false)
const deleteConfirm = ref<string>()

function deletePrompt() {
  deleteConfirm.value = ""
  deleteDialog.value = true
}

function deletePromptCancel() {
  deleteDialog.value = false
}

function deletePromptConfirm() {
  console.log("TODO: Deleting", {id})
  deleteDialog.value = false
}

const releaseTicketsDialog = ref<boolean>(false)
const releaseTicketsAmount = ref<number>(10)

function releasePrompt() {
  releaseTicketsAmount.value = 10
  releaseTicketsDialog.value = true
}

function releasePromptCancel() {
  releaseTicketsDialog.value = false
}

async function releasePromptConfirm() {
  console.log("Releasing", {eventId: id})
  await fetchReleaseTickets(id, releaseTicketsAmount.value)
  await refreshStats()
  releaseTicketsDialog.value = false
}

const copyIdText = ref<string>("Copy");
async function copyIdToClipboard() {
  await navigator.clipboard.writeText(id)
  copyIdText.value = "Copied!"
}

</script>

<template>
  <v-main>
    <v-container v-if="error">
      <v-sheet class="pa-5" rounded elevation="8">
      <v-row>
        <v-col v-if="error">
          <ApiAlert :problem="error.data" :show-read-more="true"/>
        </v-col>
      </v-row>
      </v-sheet>
    </v-container>
    <v-container v-else-if="data">
      <v-sheet class="pa-5" rounded elevation="8">
      <div class="d-flex flex-column flex-sm-row justify-space-between ga-2 mb-3">
        <div class="d-flex flex-row flex-wrap ga-2">
          <v-btn
              append-icon="mdi-eye-outline"
              :to="`/events/${data.data.id}`"
              :disabled="!canViewEvent"
          >
            View
          </v-btn>
          <v-btn
              append-icon="mdi-pencil"
              :to="`/manage/events/byid/${data.data.id}/edit`"
              :disabled="!canUpdateEvent"
          >
            Edit
          </v-btn>
        </div>
        <div>
          <v-btn
              class="bg-red-darken-3"
              append-icon="mdi-delete"
              @click="deletePrompt()"
              :disabled="!canDeleteEvent"
          >
            Delete
          </v-btn>
        </div>
      </div>

      <v-table>
        <tbody>
        <tr>
          <th class="row-head pl-1">ID</th>
          <td class="py-1">
            <span class="queue-id mr-1">{{ data.data.id }}</span>

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
          <th class="row-head pl-1">Name</th>
          <td class="py-1">{{ data.data.name }}</td>
        </tr>
        <tr>
          <th class="row-head pl-1">Description</th>
          <td class="py-1">{{ data.data.description }}</td>
        </tr>
        <tr>
          <th class="row-head pl-1">Visible from</th>
          <td class="py-1">{{ data.data.visibleFrom ? dayjs(data.data.visibleFrom).format('LLL') : "Hidden" }}</td>
        </tr>
        <tr>
          <th class="row-head pl-1">Starts at</th>
          <td class="py-1">{{ dayjs(data.data.startTime).format('LLL') }}</td>
        </tr>
        <tr>
          <th class="row-head pl-1">Ends at</th>
          <td class="py-1">{{ dayjs(data.data.endTime).format('LLL') }}</td>
        </tr>
        </tbody>
      </v-table>

      <h2>Tickets</h2>
      <TicketPie v-if="canViewTicketStats" v-model="ticketStats" />

      <div class="d-flex flex-row flex-wrap ga-2 mt-3">
        <v-btn
            append-icon="mdi-account"
        >
          View tickets
        </v-btn>
        <v-btn
            append-icon="mdi-send"
            @click="releasePrompt()"
            :disabled="!canActivateTicket || (ticketStats && ticketStats?.inQueue == 0)"
        >
          Activate tickets
        </v-btn>
      </div>



      <!-- Release tickets dialog -->
      <v-dialog v-model="releaseTicketsDialog" max-width="600">
        <v-card
            title="Activate tickets"
            :subtitle="`Do you want to allow people to go to &quot;${data?.data.name}&quot;?`"
        >
          <template v-slot:text>
            <div class="d-flex flex-column ga-4">
              <p>
                By activating tickets you will convert tickets at the front of the
                queue to active and allow people to enter the event.
              </p>
              <v-number-input
                  v-model="releaseTicketsAmount"
                  label="Amount"
                  :min="1"
                  :max="ticketStats?.inQueue || 1000"
                  :step="5"
                  controlVariant="split"
                  inset
              ></v-number-input>
              <v-input v-model="releaseTicketsAmount" label="Amount" type="number"/>
            </div>
          </template>

          <v-card-actions class="bg-surface-light">
            <v-btn text="Cancel" @click="releasePromptCancel"></v-btn>

            <v-spacer></v-spacer>

            <v-btn text="Release" variant="elevated"
                   @click="releasePromptConfirm"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete confirm dialog -->
      <v-dialog v-model="deleteDialog" max-width="600">
        <v-card
            title="Are you sure?"
            :subtitle="`Do you want to delete &quot;${data?.data.name}&quot;`"
        >
          <template v-slot:text>
            <div class="d-flex flex-column ga-4">
              <p>
                If you are sure you want to delete the event
                "{{ data?.data.name }}", then type <code>delete</code>
                into the text box.
              </p>
              <p>
                <strong>This action is not reversible</strong>
              </p>
              <v-text-field v-model="deleteConfirm" label="Confirm delete" placeholder="delete"/>
            </div>
          </template>

          <v-card-actions class="bg-surface-light">
            <v-btn text="Cancel" @click="deletePromptCancel"></v-btn>

            <v-spacer></v-spacer>

            <v-btn text="Delete" variant="elevated" color="red-darken-1"
                   :disabled="deleteConfirm?.toLowerCase() != 'delete'" @click="deletePromptConfirm"></v-btn>
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
.queue-id {
  max-height: 1lh;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>