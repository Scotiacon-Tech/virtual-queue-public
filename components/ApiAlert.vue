<script setup lang="ts">
import type {components} from "#nuxt-api-party/queuesBackend"
type Problem = components['schemas']['Problem']
const props = defineProps<{
  problem?: Problem
  showReadMore?: boolean
}>()
</script>

<template>
  <v-alert
      type="error"
      v-if="props.problem"
  >
    <v-alert-title>{{ props.problem.title }}</v-alert-title>
    <p>{{ props.problem.detail }}</p>
    <p v-if="props.showReadMore" class="mt-3"><v-btn variant="outlined" color="white" :href="props.problem.type">Read more</v-btn></p>
  </v-alert>
  <v-alert
      type="error"
      v-else
  >
    <v-alert-title>Oh no!</v-alert-title>
    <p>An error occurred when trying to load this resource.</p>
  </v-alert>
</template>

<style scoped>

</style>