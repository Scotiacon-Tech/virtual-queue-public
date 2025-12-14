<script setup lang="ts">
import {
  type TicketPage,
    type Event,
  fetchEventDataPage,
  fetchTicketDataPage,
  type TicketState,
  fetchGetEventsByName, fetchGetEventById, fetchGetAllEvents
} from "~/composables/api/events";
import type {DataTableHeader} from "vuetify/framework";

type TicketPageItem = TicketPage['data'][0]

definePageMeta({
  title: `Manage tickets`
})
useHead({
  title: `Manage tickets`
})

requireAppPermissions(['canManageTickets'])
const canViewTicket = hasAppPermissions(['canViewTicket'])

const route = useRoute();
let eventIdFromUrl: string | undefined = undefined;
if (Array.isArray(route.query.eventId)) {
  if (route.query.eventId[0]) {
    eventIdFromUrl = route.query.eventId[0]
  }
} else {
  if (route.query.eventId) {
    eventIdFromUrl = route.query.eventId
  }
}

const allEvents = await fetchGetAllEvents();
const eventFromUrl = eventIdFromUrl ? allEvents.data.find(x => x.id === eventIdFromUrl) : undefined;

const dayjs = useDayjs();

const loading = ref(false);

const headers = ref<DataTableHeader<TicketPageItem>[]>([
  {
    title: 'Event',
    align: 'start',
    sortable: false,
    key: 'event',
    maxWidth: "500"
  },
  {
    title: 'Number',
    align: 'start',
    sortable: false,
    key: 'number',
    maxWidth: "500"
  },
  {
    title: 'Badge ID',
    align: 'start',
    sortable: false,
    key: 'badgeId',
    maxWidth: "500"
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
  },
  // {
  //   title: 'Start Time',
  //   key: 'startTime',
  // },
  // {
  //   title: 'End Time',
  //   key: 'endTime',
  //   value: (item) => isOpen(item.startTime, item.endTime)
  // },
  {
    title: 'Actions',
    key: 'actions',
    align: 'end',
    sortable: false
  }
])

const items = ref<TicketPageItem[]>([])
const totalItems = ref<number>(0)
const filterEvent = shallowRef<Event | undefined>(eventFromUrl);
const filterTicketNumber = shallowRef<string | undefined>(undefined);
const filterBadgeId = shallowRef<string | undefined>(undefined);
const filterState = shallowRef<TicketState[] | undefined>(['Active', 'Requested']);

const filter = shallowRef<Partial<{ eventId: string, ticketNumber: string, badgeid: string, state: TicketState[] }> | undefined>(undefined);
const filtersEnabled = ref<number>(0)
const filterThrottle = throttledRef(filter, 1000);
const filterLastChanged = ref<string>()
watch([filterEvent, filterTicketNumber, filterBadgeId, filterState], () => {
  console.log({filterEvent, filterTicketNumber, filterBadgeId, filterState});
  filter.value = {
    eventId: filterEvent.value?.id,
    ticketNumber: filterTicketNumber.value,
    badgeid: filterBadgeId.value,
    state: filterState.value,
  }
  filtersEnabled.value =
      (filterEvent.value ? 1 : 0) +
      (filterTicketNumber.value && filterTicketNumber.value !== "" ? 1 : 0) +
      (filterBadgeId.value && filterBadgeId.value !== "" ? 1 : 0) +
      (filterState.value && filterState.value.length > 0 ? 1 : 0)
}, {immediate: true})
watch([filterThrottle], () => {
  filterLastChanged.value = String(Date.now())
})

function clearFilters() {
  filterEvent.value = undefined
  filterTicketNumber.value = undefined
  filterBadgeId.value = undefined
  filterState.value = undefined
}

async function loadItems({page, itemsPerPage, sortBy, groupBy, search}: {
  page: number,
  itemsPerPage: number,
  sortBy: { key: string, order: 'asc' | 'desc' }[],
  groupBy: string,
  search: string
}) {
  console.log({page, itemsPerPage, sortBy, groupBy, search});
  loading.value = true;
  try {
    const {eventId, ticketNumber, badgeid, state} = filterThrottle.value ?? {}
    const data = await fetchTicketDataPage(
        page,
        itemsPerPage,
        {
          eventId: eventId,
          badgeIdLike: badgeid && badgeid !== "" ? badgeid : undefined,
          state: state,
          ticketNumber: ticketNumber && ticketNumber !== "" ? ticketNumber : undefined,
        }
    );
    console.log({data})
    totalItems.value = data.totalItems
    items.value = data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-main>
    <v-container>
      <v-sheet class="pa-5" rounded elevation="8">
        <v-data-table-server
            :headers="headers"
            :items="items"
            :items-length="totalItems"
            :loading="loading"
            :search="filterLastChanged"
            item-value="id"
            @update:options="loadItems"
            mobile-breakpoint="sm"
        >
          <template v-slot:top>

            <v-expansion-panels>
              <v-expansion-panel
                  :title="'Filters' + (filtersEnabled > 0 ? ` (${filtersEnabled})` : '')"
                  elevation="2"
              >
                <v-expansion-panel-text>
                  <v-autocomplete
                      label="Event"
                      item-title="name"
                      :items="allEvents.data"
                      v-model="filterEvent"
                      clearable
                      chips
                      hide-details
                  ></v-autocomplete>

<!--                  <v-text-field-->
<!--                      label="Event"-->
<!--                      v-model="filterEvent"-->
<!--                      hide-details-->
<!--                  ></v-text-field>-->

                  <v-text-field
                      label="Ticket Number"
                      v-model="filterTicketNumber"
                      hide-details
                  ></v-text-field>

                  <v-text-field
                      label="Badge ID"
                      v-model="filterBadgeId"
                      hide-details
                  ></v-text-field>

                  <v-combobox
                      chips
                      multiple
                      v-model="filterState"
                      label="States"
                      :items="['Requested', 'Active', 'CheckedIn', 'OnHold', 'Consumed', 'Expired', 'Revoked'] satisfies TicketState[]"
                  ></v-combobox>

                  <v-btn @click="clearFilters">
                    Clear
                  </v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

          </template>

          <template v-slot:item.event="{ item }">
            {{ item.event.name }}
          </template>

          <template v-slot:item.number="{ item }">
            {{ item.name }}
          </template>

          <template v-slot:item.badgeId="{ item }">
            {{ item.badgeId }}
          </template>

          <template v-slot:item.status="{ item }">
            {{ item.stateDescription }}
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
              <v-btn
                  :to="`/manage/tickets/byid/${item.id}`"
                  :title="`More information for ${item.event.name} ${item.name}`"
                  density="default"
                  variant="tonal"
              >
                More Info
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-sheet>
    </v-container>
  </v-main>
</template>

<style scoped>

</style>