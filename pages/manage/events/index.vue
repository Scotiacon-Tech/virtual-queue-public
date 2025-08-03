<script setup lang="ts">
import {useEventDataPage} from "~/composables/api/events";
import {usePagination} from "~/composables/pagination";

const dayjs = useDayjs();
const router = useRouter();

const pageSize = ref(25);
let page = usePagination()

const {data, error} = await useEventDataPage(page, pageSize, {includeInvisible: true});

function fmtDate(s: string) {
  return dayjs(s).format('LL LT z');
}

watch(page, () => {
  router.replace({query: {page: page.value}})
})
</script>

<template>
  <v-main>
    <v-container>
      <h1 class="text-h4 mb-5">Manage Events</h1>
      <v-row>
        <v-col cols="4">
          <v-btn
              to="/manage/events/new"
              prepend-icon="mdi-calendar-plus"
              aria-description="Create a new event">
            NEW
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
              prepend-inner-icon="mdi-magnify"
              density="compact"
              label="Search events"
              variant="solo"
              hide-details
              single-line
              class="mb-2"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-col v-if="error">
        <ApiAlert :problem="error.data"/>
      </v-col>

      <p v-if="!data || data.totalItems == 0">Found no events</p>
      <p v-else-if="data.totalItems == 1">Found 1 event</p>
      <p v-else>Found {{ data.totalItems }} event</p>

      <v-list v-if="data">
        <v-list-item v-for="event in data.data" :key="event.id">
          <v-list-item-title>{{ event.name }}</v-list-item-title>
          <v-list-item-subtitle>Opens: {{ fmtDate(event.startTime) }}, Closes: {{ fmtDate(event.endTime) }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-btn :to="`/manage/events/byid/${event.id}`">Edit</v-btn>
          </template>
        </v-list-item>
      </v-list>
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