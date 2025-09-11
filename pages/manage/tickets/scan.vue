<script setup lang="ts">
import type { DetectedBarcode } from 'nuxt-qrcode'
import {fetchGetTicket} from "~/composables/api/events";

definePageMeta({
  title: `Scan tickets`
})
useHead({
  title: `Scan tickets`
})

const result = ref<{
  id: string
  name: string
  state: "Requested" | "Active" | "OnHold" | "Consumed" | "Revoked" | "CheckedIn"
  eventName: string,
  heldAtPosition?: number
} | undefined>()
const state = reactive({
  errorMsg: '',
  error: false,
})

async function getTicket(id: string) {
  try {
    const {data: ticket, related} = await fetchGetTicket(id, {includeEvent: true});
    result.value = {
      id: ticket.id,
      name: ticket.name,
      state: ticket.state,
      eventName: related?.event?.name || "",
      heldAtPosition: ticket.held_at_position,
    };
  } catch (error) {
    console.log(error)
  }
}

function onDetect(detectedCodes: DetectedBarcode[]) {
  console.log("Detected", detectedCodes);
  if (detectedCodes.length > 0) {
    const text = detectedCodes[0].rawValue
    if (text.startsWith("ticket:")) {
      const id = text.substring(7, text.length)
      getTicket(id)
    }
  }
}

function onError(err: Error) {
  state.error = true
  state.errorMsg = `[${err.name}]: ${err.message}`
}
</script>

<template>
  <v-main>
    <div v-if="!state.error">
      <QrcodeStream
          class="camera"
          @error="onError"
          @detect="onDetect"
          style="max-height: 50vh; aspect-ratio: 1/1;"
      />
    </div>
    <div v-else>
      <h3>
        {{ state.errorMsg }}
      </h3>
      <button @click="state.error = false">
        reset
      </button>
    </div>

    <v-container>
    <v-row v-if="result" class="my-0 mx-2 justify-center">
      <v-col>
        <p><strong>Ticket ID:</strong> <code>{{result.id}}</code> </p>
        <p><strong>Event:</strong> {{result.eventName}} </p>
        <p><strong>State:</strong> {{result.state}} </p>
        <v-btn block class="mt-3" :disabled="result.state != 'Active'">Mark ticket as used</v-btn>
      </v-col>
    </v-row>
  </v-container>
  </v-main>
</template>

<style scoped>
.camera {
  max-height: 50dvh
}
</style>