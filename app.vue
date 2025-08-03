<script setup lang="ts">
import {useDayjs} from "#dayjs";
useDayjs().tz.setDefault()

import type {components} from "#nuxt-api-party/queuesBackend";

const {data: capabilities, error: capabilitiesError, pending: capabilitiesPending} = await useQueuesBackendData(
    '/capabilities',
    {
      transform: res => {
        const canManageEventActions: components["schemas"]["Action"][] = ["event:create", "event:update", "event:delete"]
        const canManageTicketActions: components["schemas"]["Action"][] = ["ticket:revoke", "ticket:activate", "ticket:consume"] // TODO: Self vs All permissions
        const canManageEvents = canManageEventActions.map(a => res.user.allowedActions.includes(a)).reduce((a, b) => a || b) || false
        const canManageTickets = canManageTicketActions.map(a => res.user.allowedActions.includes(a)).reduce((a, b) => a || b) || false
        return {
          canManageEvents: canManageEvents,
          canManageTickets: canManageTickets,
        }
      }
    }
);

const permissions = useAppPermissions()

let newPermissions: AppPermissions = {
  canManageEvents: false,
  canManageTickets: false,
}
if (capabilities.value) {
  if (capabilities.value.canManageEvents) {
    newPermissions.canManageEvents = true
  }
  if (capabilities.value.canManageTickets) {
    newPermissions.canManageTickets = true
  }
}
permissions.value = newPermissions



</script>

<template>
  <NuxtLoadingIndicator/>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>