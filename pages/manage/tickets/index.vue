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
const now = dayjs();

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
    title: 'Owner',
    align: 'start',
    sortable: false,
    key: 'owner',
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
const filterOwner = shallowRef<string | undefined>(undefined);
const filterState = shallowRef<TicketState[] | undefined>(undefined);

const filter = shallowRef<Partial<{ eventId: string, ticketNumber: string, owner: string, state: TicketState[] }> | undefined>(undefined);
const filtersEnabled = ref<number>(0)
const filterDebounce = debouncedRef(filter, 1000);
const filterLastChanged = ref<string>()
watch([filterEvent, filterTicketNumber, filterOwner, filterState], () => {
  console.log({filterEvent, filterTicketNumber, filterOwner, filterState});
  filter.value = {
    eventId: filterEvent.value?.id,
    ticketNumber: filterTicketNumber.value,
    owner: filterOwner.value,
    state: filterState.value,
  }
  filtersEnabled.value =
      (filterEvent.value ? 1 : 0) +
      (filterTicketNumber.value && filterTicketNumber.value !== "" ? 1 : 0) +
      (filterOwner.value && filterOwner.value !== "" ? 1 : 0) +
      (filterState.value && filterState.value.length > 0 ? 1 : 0)
}, {immediate: true})
watch([filterDebounce], () => {
  filterLastChanged.value = String(Date.now())
})

function clearFilters() {
  filterEvent.value = undefined
  filterTicketNumber.value = undefined
  filterOwner.value = undefined
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
    const {eventId, ticketNumber, owner, state} = filterDebounce.value ?? {}
    const data = await fetchTicketDataPage(
        page,
        itemsPerPage,
        {
          eventId: eventId,
          owner: owner && owner !== "" ? owner : undefined,
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
                      label="Owner"
                      v-model="filterOwner"
                      hide-details
                  ></v-text-field>

                  <v-combobox
                      chips
                      multiple
                      v-model="filterState"
                      label="States"
                      :items="['Requested', 'Active', 'CheckedIn', 'OnHold', 'Consumed', 'Revoked'] satisfies TicketState[]"
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

          <template v-slot:item.owner="{ item }">
            {{ item.owner }}
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