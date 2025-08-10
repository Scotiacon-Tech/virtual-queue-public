<script setup lang="ts">
import ApiAlert from "~/components/ApiAlert.vue";
import {useGetEventById} from "~/composables/api/events";

definePageMeta({
  title: `Manage event`
})
useHead({
  title: `Manage event`
})

const route = useRoute();
let id = route.params.id as string

const {data, error} = await useGetEventById(id);
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
      <EventForm submit-text="Save" v-model="data!.data" />
      <v-divider class="my-6"></v-divider>
      <h2>Queues</h2>
    </v-container>
  </v-main>
</template>

<style scoped>

</style>