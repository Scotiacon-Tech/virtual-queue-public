<script setup lang="ts">
import {fetchPermissions} from "~/composables/permissions";

import {useDayjs} from "#dayjs";
import ErrorView from "~/components/ErrorView.vue";

useDayjs().tz.setDefault()
useAppPermissions(await fetchPermissions())

</script>

<template>
  <NuxtPwaAssets />
  <NuxtLoadingIndicator/>
  <NuxtErrorBoundary>
    <template #error="{error, clearError}">
      <ErrorView :error="error" :clearError="clearError"/>
    </template>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </NuxtErrorBoundary>
</template>