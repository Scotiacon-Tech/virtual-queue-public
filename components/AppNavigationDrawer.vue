<script setup lang="ts">
import {hasAppPermissions} from "~/composables/permissions";

const model = defineModel<boolean>()
const canManageEvents = hasAppPermissions(['canManageEvents'])
const canManageTickets = hasAppPermissions(['canManageTickets'])
</script>

<template>
  <v-navigation-drawer
      v-model="model"
      temporary
  >
    <v-list>
      <v-list-item
          prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
      >
        <v-list-item-title>John Leider</v-list-item-title>
        <v-list-item-subtitle>john@google.com</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

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
        <template v-slot:prepend>
          <v-icon icon="mdi-home"/>
        </template>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <v-list-item
          color="primary"
          to="/events"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-calendar-text"/>
        </template>
        <v-list-item-title>Events</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-subheader>My stuff</v-list-subheader>

      <v-list-item
          color="primary"
          to="/my/tickets"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-ticket"></v-icon>
        </template>
        <v-list-item-title>My Tickets</v-list-item-title>
      </v-list-item>

      <v-divider v-if="canManageEvents || canManageTickets"></v-divider>

      <v-list-subheader v-if="canManageEvents || canManageTickets">Manage</v-list-subheader>

      <v-list-item
          v-if="canManageEvents"
          color="primary"
          to="/manage/events"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-calendar-edit-outline"/>
        </template>
        <v-list-item-title>Manage Events</v-list-item-title>
      </v-list-item>

      <v-list-item
          v-if="canManageTickets"
          color="primary"
          to="/manage/tickets"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-ticket"/>
        </template>
        <v-list-item-title>Manage Tickets</v-list-item-title>
      </v-list-item>

      <v-list-item
          v-if="canManageTickets"
          color="primary"
          to="/manage/tickets/scan"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-camera"/>
        </template>
        <v-list-item-title>Scan Tickets</v-list-item-title>
      </v-list-item>

      <v-divider class="mb-1"></v-divider>

      <v-list-item
          color="primary"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-logout"/>
        </template>
        <v-list-item-title>Log out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>