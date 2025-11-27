<script setup lang="ts">
import type { DetectedBarcode } from 'nuxt-qrcode'
import {
  fetchGetTicket,
  fetchUpdateTicket,
  type TicketItem
} from "~/composables/api/events";

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


const scannedText = ref("")
const scannedTicket = ref<TicketItem | undefined>()
const state = reactive({
  errorMsg: '',
  error: false,
})

const autoCheckIn = ref(false)
const autoConsume = ref(false)

function setScannedTicket(data: TicketItem) {
  scannedTicket.value = data
}


async function getTicket(id: string) {
  try {
    const data = await fetchGetTicket(id, {includeEvent: true});
    setScannedTicket(data)
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
    setScannedTicket(data)
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
    setScannedTicket(data)
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
      getTicket(id).then(data => {
        debugger
        if (data && data.eventId == props.eventId) {
          if (data.state == 'Active' && autoCheckIn.value) {
            checkInTicket(data.id)
          }
          if (data.state == 'CheckedIn' && autoConsume.value) {
            consumeTicket(data.id)
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
      <v-card class="my-0 mx-2 justify-center">
        <v-col>
          <p><strong>Event:</strong> {{props.eventName}} </p>
          <v-row>
            <v-checkbox v-model="autoCheckIn" label="Auto check-in"></v-checkbox>
            <v-checkbox v-model="autoConsume" label="Auto use"></v-checkbox>
          </v-row>
          <p v-if="scannedTicket"><strong>Ticket ID:</strong> <code>{{ scannedTicket.id }}</code> </p>
          <p v-if="scannedTicket"><strong>State:</strong> {{ scannedTicket.state }} </p>
          <v-btn v-if="scannedTicket" block class="mt-3" :disabled="checkInBusy || !scannedTicket || scannedTicket.eventId != eventId || scannedTicket.state != 'Active'">Mark ticket as checked in</v-btn>
          <v-btn v-if="scannedTicket" block class="mt-3" :disabled="consumeBusy || !scannedTicket || scannedTicket.eventId != eventId || scannedTicket.state != 'CheckedIn'">Mark ticket as used</v-btn>
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
</style>