<script setup lang="ts">
import type {NuxtError} from "#app";

const { error } = defineProps({
  error: Object as () => NuxtError,
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <v-app>
    <v-container>
      <v-main>
        <v-alert
            type="error"
        >
          <v-alert-title>{{ error?.statusMessage }} {{ error?.statusCode }}</v-alert-title>
          <p>{{ error?.message }}</p>
          <p class="mt-4 mb-2">
            <pre>{{ error?.stack }}</pre>
          </p>
        </v-alert>
      </v-main>
    </v-container>
  </v-app>
</template>
