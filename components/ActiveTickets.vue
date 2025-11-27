<script setup lang="ts">
import {useMyActiveTickets} from "~/composables/api/events";

const {data, error} = useMyActiveTickets({pageSize: 0})
const numTickets = computed(() => {
  if (data.value) {
    return data.value.totalItems;
  } else {
    return 0;
  }
})

</script>

<template>
  <p v-if="numTickets" class="mt-2 mb-3">
    You have {{ numTickets }} active tickets
  </p>
  <v-btn v-if="numTickets" to="/my/tickets" class="mt-4">See my tickets</v-btn>
  <slot v-if="numTickets" name="after"></slot>
</template>

<style scoped>

</style>