<script setup lang="ts">
import {useMyTickets} from "~/composables/api/events";
import {usePagination} from "~/composables/pagination";

definePageMeta({
  title: `My tickets`
})
useHead({
  title: `My tickets`
})

let page = usePagination()
const {data, error} = useMyTickets(page.value)
</script>

<template>
  <v-main>
    <v-container>
      <v-row dense>
        <v-col v-if="data && data.data.length > 0" role="list" cols="12" v-for="ticket in data.data">
          <TicketSummaryCard role="listitem" :id="ticket.id" :title="ticket.event.name" description="" />
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