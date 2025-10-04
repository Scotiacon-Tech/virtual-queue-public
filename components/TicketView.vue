<script setup lang="ts">
import type {Timeout} from "unenv/node/internal/timers/timeout";
import {Dayjs} from "dayjs";
import type {TicketState} from "~/composables/api/events";

const dayjs = useDayjs()

const {qrCode, ticket} = defineProps<{
  qrCode?: boolean
  ticket: {
    readonly id: string
    readonly name: string
    event: {
      readonly name: string
    } | undefined
    readonly state: TicketState
    readonly heldAtPosition?: number
    readonly expires?: string
  }
}>()

const expires = ref<Dayjs | null>(ticket.expires ? dayjs(ticket.expires) : null)
const now = ref(dayjs())

const expiresStr = computed(() => {
  const t = expires.value
  if (t === null) {
    return null
  } else if (t.isSame(now.value, 'day')) {
    return t.format('LT')
  } else {
    return t.format('LT') + " " + t.format('LL')
  }
})


const timer = ref<Timeout<any>>()
onMounted(() => {
  timer.value = setInterval(() => {
    now.value = dayjs()
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<template>
  <section class="ticket my-3">
    <p role="presentation" class="ticket-top-banner">{{ now.format('YYYYMMDDTHHmmss') }}</p>
    <p role="presentation" class="ticket-bottom-banner">Scotiacon</p>
    <v-row class="mx-2 mt-0 mb-0 justify-center">
      <v-col class="ticket-details">
        <p class="text-left mb-4">
          <small>Event:</small><br/>
          <span class="font-weight-bold">{{ ticket.event?.name ?? '&lt;Unknown&gt;' }}</span>
        </p>
        <p class="text-left mb-4">
          <small>Ticket number:</small><br/>
          <span class="text-h3 ">{{ ticket.name }}</span>
        </p>
        <p>
          <v-chip
              v-if="ticket.state === 'Requested'"
              color="primary"
          >
            In queue
          </v-chip>
          <v-chip
              v-if="ticket.state === 'Active' && expiresStr"
              color="success"
              variant="elevated"
          >
            Valid until {{ expiresStr }}
          </v-chip>
          <v-chip
              v-if="ticket.state === 'Active' && !expiresStr"
              color="success"
              variant="elevated"
          >
            Valid
          </v-chip>
          <v-chip
              v-if="ticket.state === 'Expired'"
              color="red"
              variant="elevated"
          >
            Expired at {{ expiresStr }}
          </v-chip>
          <v-chip
              v-if="ticket.state === 'OnHold'"
              color="secondary"
              variant="elevated"
          >
            On hold
          </v-chip>
          <v-chip
              v-if="ticket.state === 'Consumed'"
              color="primary"
          >
            Used
          </v-chip>
          <v-chip
              v-if="ticket.state === 'Revoked'"
              color="primary"
          >
            Revoked
          </v-chip>
        </p>
      </v-col>
      <v-col v-if="qrCode" class="flex-grow-0">
        <Qrcode class="ticket-qrcode" width="200" height="200" ecc="Q" :value="`ticket:${ticket.id}`" />
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

  border-width: 60px 0px 60px 0px;
  border-style: solid;
  border-color: darkorange;
  border-radius: 20px;

  background: khaki;

  box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.5);
}

.ticket-top-banner {
  position: absolute;
  top: calc(-1lh - 16px);
  left: 0;
  text-align: center;
  width: 100%;
  overflow: hidden;
  padding: 8px 16px;

  background: linear-gradient(
      90deg,
      rgba(255, 0, 0, 1) 0%,
      rgba(255, 154, 0, 1) 10%,
      rgba(208, 222, 33, 1) 20%,
      rgba(79, 220, 74, 1) 30%,
      rgba(63, 218, 216, 1) 40%,
      rgba(47, 201, 226, 1) 50%,
      rgba(28, 127, 238, 1) 60%,
      rgba(95, 21, 242, 1) 70%,
      rgba(186, 12, 248, 1) 80%,
      rgba(251, 7, 217, 1) 90%,
      rgba(255, 0, 0, 1) 100%
  );
  background-size: 400% 400%;
  background-clip: text;
  color: transparent;
  text-shadow: none;

  animation: move-prototype-bg 10s linear infinite;
}

.ticket-bottom-banner {
  position: absolute;
  bottom: calc(-1lh - 16px);
  left: 0;
  text-align: left;
  width: 100%;
  font-weight: bold;
  font-size: 2rem;
  color: white;
  overflow: hidden;
  padding: 8px 16px;
}

.ticket-details {
  flex-basis: 200px;
}

.ticket-qrcode {
}

@keyframes move-prototype-bg {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>