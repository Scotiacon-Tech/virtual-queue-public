<script setup lang="ts">
import {hasAppPermissions} from "~/composables/permissions";

const model = defineModel<boolean>()
const canManageEvents = hasAppPermissions(['canManageEvents'])
const canManageTickets = hasAppPermissions(['canManageTickets'])

const {user} = useOidcAuth()
</script>

<template>
  <v-navigation-drawer
      v-model="model"
      temporary
  >
    <v-list v-if="user">
      <v-list-item>
        <v-list-item-title v-if="user.userInfo">Hello, {{ user.userInfo.name }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list
        :lines="false"
        density="compact"
        nav
    >
      <v-list-item
          color="primary"
          exact
          to="/"
      >
        <template #prepend>
          <v-icon icon="mdi-home"/>
        </template>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <v-list-item
          color="primary"
          to="/events"
      >
        <template #prepend>
          <v-icon icon="mdi-calendar-text"/>
        </template>
        <v-list-item-title>Events</v-list-item-title>
      </v-list-item>

      <v-divider />

      <v-list-subheader>My stuff</v-list-subheader>

      <v-list-item
          color="primary"
          to="/my/tickets"
      >
        <template #prepend>
          <v-icon icon="mdi-ticket" />
        </template>
        <v-list-item-title>My Tickets</v-list-item-title>
      </v-list-item>

      <v-list-item
          color="primary"
          to="/my/settings"
      >
        <template #prepend>
          <v-icon icon="mdi-cog" />
        </template>
        <v-list-item-title>My Settings</v-list-item-title>
      </v-list-item>

      <v-divider v-if="canManageEvents || canManageTickets" />

      <v-list-subheader v-if="canManageEvents || canManageTickets">Manage</v-list-subheader>

      <v-list-item
          v-if="canManageEvents"
          color="primary"
          to="/manage/events"
      >
        <template #prepend>
          <v-icon icon="mdi-calendar-edit-outline"/>
        </template>
        <v-list-item-title>Manage Events</v-list-item-title>
      </v-list-item>

      <v-list-item
          v-if="canManageTickets"
          color="primary"
          to="/manage/tickets"
      >
        <template #prepend>
          <v-icon icon="mdi-ticket"/>
        </template>
        <v-list-item-title>Manage Tickets</v-list-item-title>
      </v-list-item>

      <v-list-item
          v-if="canManageTickets"
          color="primary"
          to="/manage/tickets/scan"
      >
        <template #prepend>
          <v-icon icon="mdi-camera"/>
        </template>
        <v-list-item-title>Scan Tickets</v-list-item-title>
      </v-list-item>

      <v-divider class="mb-1" />

      <v-list-item
          color="primary"
          to="/auth/logout"
      >
        <template #prepend>
          <v-icon icon="mdi-logout"/>
        </template>
        <v-list-item-title>Log out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>