<script setup lang="ts">
import {useMyTickets} from "~/composables/api/events";
import {usePagination} from "~/composables/pagination";

definePageMeta({
  title: `My tickets`
})
useHead({
  title: `My tickets`
})

const page = ref(usePagination())
const subject = useSubject()
const {data: tickets, refresh: refreshTickets} = useMyTickets(subject.value, page.value)

async function refresh() {
  await refreshTickets({cause: "refresh:manual"})
}

</script>

<template>
  <v-main>
    <v-container>
      <v-row dense>
        <VCol v-if="!tickets?.data.length">
          <VAlert type="info">
            <VAlertTitle>Oh no!</VAlertTitle>
            <p>You have no tickets</p>
          </VAlert>
        </VCol>
        <VCol
              v-for="ticket in tickets?.data"
              :key="ticket.id"
              role="list"
              cols="12"
        >
          <TicketCard role="listitem" :ticket="ticket" @refresh="refresh"/>
        </VCol>
      </v-row>
      <v-row v-if="!!tickets?.data.length">
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