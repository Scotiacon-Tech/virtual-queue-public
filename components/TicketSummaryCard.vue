<script setup lang="ts">
const {id, title, description} = defineProps<{
  id: string
  title: string
  description: string
}>()

</script>

<template>
  <v-card
      class="card"
      elevation="2"
      rounded
      append-icon="mdi-ticket"
      :title="title"
      :subtitle="description"
  >
    <v-card-actions>
      <slot name="actions"></slot>
      <v-btn :to="`/tickets/${id}`" variant="outlined">More Info</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.card {
  border-left: 8px solid rgb(var(--v-theme-primary));
}

</style>