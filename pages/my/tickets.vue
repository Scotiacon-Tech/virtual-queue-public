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
const subject = useSubject()
const {data: tickets, refresh: refreshTickets, error} = useMyTickets(subject.value, page.value)

async function refresh() {
  await refreshTickets({cause: "refresh:manual"})
}

</script>

<template>
  <v-main>
    <v-container>
      <v-row dense>
        <v-col v-if="tickets && tickets.data.length > 0" role="list" cols="12" v-for="ticket in tickets.data">
          <TicketCard role="listitem" :ticket="ticket" @refresh="refresh"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-pagination
              v-model="page"
              :length="tickets?.totalPages ?? 0"
              class="my-2"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>

</style>