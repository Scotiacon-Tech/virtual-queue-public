<script setup lang="ts">
import ApiAlert from "~/components/ApiAlert.vue";
import {fetchCreateEvent, fetchUpdateEvent, useGetEventById} from "~/composables/api/events";

definePageMeta({
  title: `Manage event`
})
useHead({
  title: `Manage event`
})
requireAppPermissions(['canUpdateEvent'])

const router = useRouter();
const route = useRoute();
let id = route.params.id as string

const {data, error, clear} = await useGetEventById(id);

const submitDisabled = ref(false);

async function submit(ev: Readonly<{
  name: string
  description: string
  startTime: string
  endTime: string
  visibleFrom?: string
}>) {
  submitDisabled.value = true
  try {
    await fetchUpdateEvent(id, ev)
    clear() // Clear the cache for the page transition.
    await router.push(`/manage/events/byid/${id}`);
  } catch (error) {
    // TODO
  } finally {
    submitDisabled.value = false
  }
}
</script>

<template>
  <v-main>
    <v-container v-if="error">
      <v-row>
        <v-col v-if="error">
          <ApiAlert :problem="error.data" :show-read-more="true"/>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <EventForm
          submit-text="Save"
          :submit-disabled="submitDisabled"
          v-model="data!.data"
          @submit="submit"
      />
    </v-container>
  </v-main>
</template>

<style scoped>

</style>