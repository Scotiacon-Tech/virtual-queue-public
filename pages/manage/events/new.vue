<script setup lang="ts">
import {useCreateEvent} from "~/composables/api/events";

definePageMeta({
  title: `Create a new event`
})
useHead({
  title: `Create a new event`
})

const submitDisabled = ref(false);
const createdEvent = ref<{ id: string, name: string } | null>(null)

async function submit(ev: {
  name: string
  startTime: string
  endTime: string
  visibleFrom?: string
}) {
  submitDisabled.value = true
  const {data} = await useCreateEvent(ev)

  if (data.value) {
    console.log("Created new event", {id: data.value.data.id})
    createdEvent.value = {
      id: data.value.data.id,
      name: data.value.data.name,
    }
  }
}

function reset() {
  submitDisabled.value = false
  createdEvent.value = null
}
</script>

<template>
  <v-main>
    <v-container>
      <EventForm
          submit-text="Create"
          :allow-reset="true"
          :submit-disabled="submitDisabled"
          @submit="submit"
          @reset="reset"
      />

      <v-row v-if="createdEvent != null">
        <v-col>
          <v-alert type="success">
            <v-alert-title>Event "{{ createdEvent.name }}" created</v-alert-title>
            <v-btn class="mt-4" variant="outlined" color="grey-lighten-5"
                   :to="`/manage/events/byid/${createdEvent.id}`">Edit
            </v-btn>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>

</style>