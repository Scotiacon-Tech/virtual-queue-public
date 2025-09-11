<script setup lang="ts">
import {fetchPermissions} from "~/composables/permissions";

import {useDayjs} from "#dayjs";
useDayjs().tz.setDefault()
useAppPermissions(await fetchPermissions())
</script>

<template>
  <NuxtLoadingIndicator/>
  <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
</template>