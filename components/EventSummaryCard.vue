<script setup lang="ts">
import type {Dayjs} from "dayjs";

const dayjs = useDayjs()

const props = defineProps<{
  id: string
  title: string
  description: string
  openTime?: string
  closeTime?: string
}>()

let open = false
let subtitle = ""
if (props.openTime !== undefined && props.closeTime !== undefined) {
  const now = dayjs()
  const openTime = dayjs(props.openTime)
  const closeTime = dayjs(props.closeTime)

  if (now.isBefore(openTime)) {
    if (now.isSame(openTime, 'day')) {
      subtitle = `Opens at ${openTime.format('LT')}`
    } else {
      subtitle = `Opens ${openTime.format('LL')}`
    }
  } else if (now.isBefore(closeTime)) {
    open = true
    if (now.isSame(closeTime, 'day')) {
      subtitle = `Closes at ${closeTime.format('LT')}`
    } else {
      subtitle = `Closes ${closeTime.format('LL')}`
    }
  } else {
    subtitle = `Closed`
  }
}
</script>

<template>
  <v-card role="listitem" class="my-4">
      <v-card-title>{{ props.title }}</v-card-title>
      <v-card-subtitle>
        <v-chip v-if="open" color="green" variant="flat" class="mr-1">
          Open
        </v-chip>
        {{ subtitle }}</v-card-subtitle>
      <v-card-text>{{ props.description }}</v-card-text>
      <v-card-actions>
        <v-btn :to="`/events/${id}`">More Info</v-btn>
      </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>