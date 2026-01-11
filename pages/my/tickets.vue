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
const { data: tickets, refresh: refreshTickets } = await useMyTickets(subject.value, page.value)

async function refresh() {
  await refreshTickets({cause: "refresh:manual"})
}

</script>

<template>
  <VMain>
    <VContainer>
      <VRow dense>
        <VCol v-if="!tickets?.data.length">
          <VAlert type="warning" color="primary">
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
      </VRow>
      <VRow v-if="!!tickets?.data.length">
        <VCol cols="12">
          <VPagination
              v-model="page"
              :length="tickets?.totalPages ?? 0"
              class="my-2"
          />
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<style scoped>

</style>