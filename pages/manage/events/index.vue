<script setup lang="ts">
import {type Event as ApiEvent, fetchEventDataPage} from "~/composables/api/events";
import type {DataTableHeader} from "vuetify/framework";

definePageMeta({
  title: "Manage events",
})
useHead({
  title: "Manage events",
})
requireAppPermissions(['canManageEvents'])
const canCreateEvent = hasAppPermissions(['canCreateEvent'])
const canViewEvent = hasAppPermissions(['canViewEvent'])

const dayjs = useDayjs();
const now = dayjs();

const loading = ref(false);

const headers = ref<DataTableHeader<ApiEvent>[]>([
  {
    title: 'Name',
    align: 'start',
    sortable: false,
    key: 'name',
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

type Item = ApiEvent & {status: 'open' | 'closed' }
const items = ref<Item[]>([])
const totalItems = ref<number>(0)
const search = shallowRef<string | undefined>(undefined);
const searchDebounce = refDebounced(search, 500);

function isOpen(start: string, end: string) {
  const startTime = dayjs(start)
  const endTime = dayjs(end)
  return startTime.isBefore(now) && endTime.isAfter(now)
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
    console.log(sortBy[0])
    const data = await fetchEventDataPage(
        page,
        itemsPerPage,
        {
          includeInvisible: true,
          nameLike: search ? search : undefined
        }
    );
    totalItems.value = data.totalItems
    items.value = data.data.map(el => ({
      ...el,
      status: isOpen(el.startTime, el.endTime) ? 'open' : 'closed',
    }))
  } catch (e) {

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
          :search="searchDebounce"
          item-value="id"
          @update:options="loadItems"
          mobile-breakpoint="sm"
      >
        <template v-slot:top>
          <v-row>
            <v-col>
          <v-btn
              to="/manage/events/new"
              variant="flat"
              class="me-2"
              prepend-icon="mdi-plus"
              text="Create a new Event"
              color="primary"
              :disabled="!canCreateEvent"
          />
            </v-col>
          </v-row>

          <v-text-field
              label="Search by name"
              v-model="search"
              class="pa-3 mt-3"
              density="compact"
              prepend-icon="mdi-magnify"
              hide-details
          ></v-text-field>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip v-if="item.status == 'open'" rounded color="green">Open</v-chip>
          <v-chip v-else rounded color="red">Closed</v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-btn
                :to="`/manage/events/byid/${item.id}`"
                :title="`More information for ${item.name}`"
                density="default"
                variant="tonal"
                :disabled="!canViewEvent"
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