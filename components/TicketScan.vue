<script setup lang="ts">
import type {DetectedBarcode} from 'nuxt-qrcode'
import {fetchGetTicket, fetchUpdateTicket, type TicketItem} from "~/composables/api/events";

const props = defineProps<{
  eventId: string,
  eventName: string,
}>(

)

const allowedCamera = ref(false);

async function askPermission() {
  const cameraPermissions = await navigator.permissions.query({name: "camera"})
  if (cameraPermissions.state !== "denied") {
    allowedCamera.value = true;
  }
}

onMounted(async () => {
  if (import.meta.browser) {
    await askPermission()
  }
})

const modes = [
  {value: 'normal', label: 'Normal'},
  {value: 'auto-checkin', label: 'Automatic Check In'},
  {value: 'auto-consume', label: 'Automatic Mark as Used'},
]
const mode = ref(modes[0])

const scannedText = ref("")
const scannedTicket = ref<TicketItem | undefined>()
const state = reactive({
  errorMsg: '',
  error: false,
})

const settingsDialog = ref(false)
async function getTicket(id: string) {
  try {
    const data = await fetchGetTicket(id, {includeEvent: true});
    scannedTicket.value = data
    return data;
  } catch (error) {
    console.log(error)
    return undefined
  }
}

const checkInBusy = ref(false)
async function checkInTicket(id: string) {
  try {
    checkInBusy.value = true
    console.log(`Checking ticket ${id}`)
    const data = await fetchUpdateTicket(id, {state: 'CheckedIn'})
    scannedTicket.value = data
  } catch (error) {
    console.log(error)
  } finally {
    checkInBusy.value = false
  }
}

const consumeBusy = ref(false)
async function consumeTicket(id: string) {
  try {
    consumeBusy.value = true
    console.log(`Consuming ticket ${id}`)
    const data = await fetchUpdateTicket(id, {state: 'Consumed'})
    scannedTicket.value = data
  } catch (error) {
    console.log(error)
  } finally {
    consumeBusy.value = false
  }
}

function onDetect(detectedCodes: DetectedBarcode[]) {
  console.log("Detected", detectedCodes);
  if (detectedCodes.length > 0 && detectedCodes[0]) {
    const text = detectedCodes[0].rawValue
    if (scannedText.value === text) {
      return
    }
    scannedText.value = text
    if (text.startsWith("ticket:")) {
      const id = text.substring(7, text.length)
      scannedTicket.value = undefined
      getTicket(id).then(data => {
        if (data && data.eventId == props.eventId) {
          switch (mode.value?.value) {
            case 'auto-checkin': checkInTicket(data.id); break;
            case 'auto-consume': consumeTicket(data.id); break;
          }
        }
      }).catch(console.error)
    }
  }
}

function onError(err: Error) {
  state.error = true
  state.errorMsg = `[${err.name}]: ${err.message}`
}
</script>

<template>
  <ClientOnly v-if="allowedCamera">
    <div v-if="!state.error">
      <QrcodeStream
          class="camera"
          @error="onError"
          @detect="onDetect"
          style="max-height: 50vh; aspect-ratio: 1/1;"
          :formats="['qr_code']"
      />
    </div>
    <div v-else>
      <h3>
        {{ state.errorMsg }}
      </h3>
      <v-btn @click="state.error = false">
        Check permissions
      </v-btn>
    </div>

    <v-container>
      <v-card class="my-0 mx-2 justify-center" :title="props.eventName" >
        <template v-slot:append>
          <v-btn icon="mdi-cog-outline" variant="text" @click="settingsDialog = true"/>
        </template>
        <v-dialog
            v-model="settingsDialog"
            width="auto"
        >
          <v-card
              min-width="300"
              max-width="500"
              title="Settings"
          >
            <v-col>
            <v-select
                v-model="mode"
                :items="modes"
                item-title="label"
                item-value="value"
                label="Mode"
                return-object
                hide-details
                density="comfortable"
            ></v-select>
            </v-col>
            <template v-slot:actions>
              <v-btn
                  class="ms-auto"
                  text="Ok"
                  @click="settingsDialog = false"
              ></v-btn>
            </template>
          </v-card>
        </v-dialog>

        <v-col class="pt-0 mt-0">
          <p v-if="scannedTicket" class="ticket-id"><strong>Ticket ID:</strong> <code>{{ scannedTicket.id }}</code> </p>
          <p v-if="scannedTicket" class="ticket-state"><strong>State:</strong> {{ scannedTicket.state }} </p>
          <v-btn v-if="scannedTicket" block class="mt-3" :disabled="checkInBusy || !scannedTicket || scannedTicket.eventId != eventId || scannedTicket.state != 'Active'">Mark ticket as checked in</v-btn>
          <v-btn v-if="scannedTicket" block class="mt-3" :disabled="consumeBusy || !scannedTicket || scannedTicket.eventId != eventId || scannedTicket.state != 'CheckedIn'">Mark ticket as used</v-btn>
          <p v-if="scannedText && !scannedTicket">
            Loading <br/><code>{{scannedText}}</code>
          </p>
          <p v-else-if="!scannedText">
            Scan a ticket 🎟️
          </p>
        </v-col>
      </v-card>
    </v-container>
  </ClientOnly>
  <div v-else>
    <v-btn @click="askPermission" block class="mt-3">
      Get permissions for camera
    </v-btn>
  </div>
</template>

<style scoped>
.camera {
  max-height: 50dvh
}
.ticket-id {
  font-size: 8pt;
}
.ticket-state {
  font-size: 8pt;
}
</style>