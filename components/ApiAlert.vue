<script setup lang="ts">
import type {components} from "#nuxt-api-party/queuesBackend"
type Problem = components['schemas']['Problem']
const { problem = {
  title: '',
  detail: '',
  type: ''
}, showReadMore } = defineProps<{
  problem?: Problem
  showReadMore?: boolean
}>()
</script>

<template>
  <v-alert
      v-if="problem"
      type="error"
  >
    <v-alert-title>{{ problem.title }}</v-alert-title>
    <p>{{ problem.detail }}</p>
    <p v-if="showReadMore" class="mt-3"><v-btn variant="outlined" color="white" :href="problem.type">Read more</v-btn></p>
  </v-alert>
  <v-alert
      v-else
      type="error"
  >
    <v-alert-title>Oh no!</v-alert-title>
    <p>An error occurred when trying to load this resource.</p>
  </v-alert>
</template>

<style scoped>

</style>