<script setup lang="ts">
const model = defineModel<boolean>()

const permissions = useAppPermissions()
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
          <v-icon icon="mdi-home" />
        </template>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <v-list-item
          color="primary"
          to="/events"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-calendar-text" />
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
          <v-badge dot>
            <v-icon icon="mdi-ticket"></v-icon>
          </v-badge>
        </template>
        <v-list-item-title>My Tickets</v-list-item-title>
      </v-list-item>

      <v-divider v-if="permissions.canManageEvents || permissions.canManageTickets"></v-divider>

      <v-list-subheader v-if="permissions.canManageEvents || permissions.canManageTickets">Manage</v-list-subheader>

      <v-list-item
          v-if="permissions.canManageEvents"
          color="primary"
          to="/manage/events"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-calendar-edit-outline" />
        </template>
        <v-list-item-title>Manage Events</v-list-item-title>
      </v-list-item>

      <v-list-item
          v-if="permissions.canManageTickets"
          color="primary"
          to="/manage/tickets"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-ticket" />
        </template>
        <v-list-item-title>Manage Tickets</v-list-item-title>
      </v-list-item>

      <v-divider class="mb-1"></v-divider>

      <v-list-item
          color="primary"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-logout" />
        </template>
        <v-list-item-title>Log out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>