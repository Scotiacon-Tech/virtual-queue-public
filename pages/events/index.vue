<script setup lang="ts">
import EventSummaryCardSkeleton from "~/components/EventSummaryCardSkeleton.vue";
import {useEventDataPage} from "~/composables/api/events";
import {usePagination} from "~/composables/pagination";

definePageMeta({
  title: `Events`
})
useHead({
  title: `Events`
})
requireAppPermissions([
    "canDoSomething"
])
const router = useRouter()

let page = usePagination()

const {data, error, pending} = await useEventDataPage(page.value, 25);

watch(page, () => {
  router.replace({query: {page: page.value}})
})
</script>

<template>
  <v-main>
  <v-container>
    <v-row dense>
      <v-col v-if="pending" role="list" cols="12">
        <EventSummaryCardSkeleton/>
        <EventSummaryCardSkeleton/>
        <EventSummaryCardSkeleton/>
      </v-col>
      <v-col v-if="!pending" role="list" cols="12">
        <EventSummaryCard
            v-if="data != null"
            v-for="event in data.data"
            :id="event.id"
            :title="event.name"
            :open-time="event.startTime"
            :close-time="event.endTime"
            description="Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"
        />
      </v-col>
      <v-col v-if="error">
        <v-alert
            type="error"
        >
          <v-alert-title>Oh no!</v-alert-title>
          <p>We were unable to load all the events. Reason: {{ error.statusMessage }}</p>
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-pagination
            v-model="page"
            :length="data?.totalPages || 0"
            class="my-2"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
  </v-main>
</template>

<style scoped>

</style>