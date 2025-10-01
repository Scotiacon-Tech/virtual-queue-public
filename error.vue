<script setup lang="ts">
import type {NuxtError} from "#app";
import ErrorView from "~/components/ErrorView.vue";

const {error} = defineProps({
  error: Object as () => NuxtError,
})

function handleError() {
  clearError({redirect: '/'})
}
</script>

<template>
  <ErrorView :error="error" :clearError="handleError" />
</template>

<style scoped>
</style>