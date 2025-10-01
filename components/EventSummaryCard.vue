<script setup lang="ts">
import type {Dayjs} from "dayjs";

const dayjs = useDayjs()

const {id, title, description, openTime, closeTime} = defineProps<{
  id: string
  title: string
  description: string
  openTime?: string
  closeTime?: string
}>()

let open = false
let subtitle = ""
if (openTime !== undefined && closeTime !== undefined) {
  const now = dayjs()
  const openTimeDate = dayjs(openTime)
  const closeTimeDate = dayjs(closeTime)

  if (now.isBefore(openTimeDate)) {
    if (now.isSame(openTimeDate, 'day')) {
      subtitle = `Opens at ${openTimeDate.format('LT')}`
    } else {
      subtitle = `Opens ${openTimeDate.format('LL')}`
    }
  } else if (now.isBefore(closeTimeDate)) {
    open = true
    if (now.isSame(closeTimeDate, 'day')) {
      subtitle = `Closes at ${closeTimeDate.format('LT')}`
    } else {
      subtitle = `Closes ${closeTimeDate.format('LL')}`
    }
  } else {
    subtitle = `Closed`
  }
}
</script>

<template>
  <v-card
      class="card"
      role="listitem"
      elevation="2"
      rounded
      append-icon="mdi-calendar-text"
      :title="title"
  >
      <v-card-subtitle>
        <v-chip v-if="open" color="green" variant="flat" class="mr-1">
          Open
        </v-chip>
        {{ subtitle }}</v-card-subtitle>
      <v-card-text>{{ description }}</v-card-text>
      <v-card-actions>
        <v-btn :to="`/events/${id}`" variant="outlined">More Info</v-btn>
      </v-card-actions>
  </v-card>
</template>

<style scoped>
.card {
  border-left: 8px solid rgb(var(--v-theme-primary))
}

</style>