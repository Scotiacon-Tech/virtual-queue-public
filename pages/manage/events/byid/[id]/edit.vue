<script setup lang="ts">
import ApiAlert from "~/components/ApiAlert.vue";
import {fetchUpdateEvent, useGetEventById} from "~/composables/api/events";

definePageMeta({
  title: `Manage event`
})
useHead({
  title: `Manage event`
})
requireAppPermissions(['canUpdateEvent'])

const router = useRouter();
const route = useRoute();
const id = route.params.id as string

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
    console.warn(error)
  } finally {
    submitDisabled.value = false
  }
}
</script>

<template>
  <v-main>
    <v-container v-if="error">
      <v-row>
        <v-col>
          <ApiAlert :problem="error.data as any" :show-read-more="true"/>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else-if="data">
      <v-sheet class="pa-5" rounded elevation="8">
      <EventForm
          v-model="data!.data"
          submit-text="Save"
          :submit-disabled="submitDisabled"
          @submit="submit"
      />
      </v-sheet>
    </v-container>
  </v-main>
</template>

<style scoped>

</style>