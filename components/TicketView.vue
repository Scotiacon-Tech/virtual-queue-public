<script setup lang="ts">
const props = defineProps<{
  qrCode?: boolean
  eventName: string
  ticket: {
    id: string
    name: string
    state: "Requested" | "Active" | "OnHold" | "Consumed" | "Revoked"
    heldAtPosition?: number
  }
}>()
</script>

<template>
  <section v-if="props.ticket" class="ticket my-3">
    <p role="presentation" style="position: absolute; top: -30px; left: 0; text-align: center; width: 100%; color: white">Scotiacon</p>
    <v-row class="mx-2 mt-0 mb-0 justify-center">
      <v-col class="ticket-details">
        <p class="text-left mb-4 font-weight-bold">{{ props.eventName }}</p>
        <p class="text-left">Ticket number:</p>
        <p class="text-left text-h3 mb-4">{{ props.ticket.name }}</p>
        <p>
          <v-chip
              v-if="props.ticket.state === 'Requested'"
              color="primary"
          >
            In queue
          </v-chip>
          <v-chip
              v-if="props.ticket.state === 'Active'"
              color="success"
              variant="elevated"
          >
            Valid
          </v-chip>
          <v-chip
              v-if="props.ticket.state === 'OnHold'"
              color="secondary"
              variant="elevated"
          >
            On hold
          </v-chip>
          <v-chip
              v-if="props.ticket.state === 'Consumed'"
              color="primary"
          >
            Used
          </v-chip>
          <v-chip
              v-if="props.ticket.state === 'Revoked'"
              color="primary"
          >
            Revoked
          </v-chip>
        </p>
      </v-col>
      <v-col v-if="props.qrCode" class="flex-grow-0">
        <Qrcode class="ticket-qrcode" width="150" height="150" ecc="L" :value="`ticket:${props.ticket.id}`" />
      </v-col>
    </v-row>
    <v-row class="ticket-actions mt-0 mx-0">
      <v-col class="mx-2 mb-2">
        <slot name="actions"></slot>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
.ticket {
  position: relative;

  width: 500px;
  max-width: 500px;

  outline: 1px solid gray;

  border-width: 40px 0px 40px 0px;
  border-style: solid;
  border-color: darkorange;
  border-radius: 20px;

  background: khaki;

  box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.5);
}

.ticket-details {
  flex-basis: 200px;
}

.ticket-qrcode {
}
</style>