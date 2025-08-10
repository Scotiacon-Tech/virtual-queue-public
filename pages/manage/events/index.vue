<script setup lang="ts">
import {type Event as ApiEvent, fetchEventDataPage} from "~/composables/api/events";
import type {DataTableHeader} from "vuetify/framework";

definePageMeta({
  title: "Manage events"
})
useHead({
  title: "Manage events"
})

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
const dialog = ref<boolean>(false)
const itemToDelete = ref<{ id: string, name: string } | null>(null)
const deleteConfirm = ref<string>()

function deletePrompt(id: string, name: string) {
  itemToDelete.value = {id, name}
  deleteConfirm.value = ""
  dialog.value = true
}

function deletePromptCancel() {
  dialog.value = false
}

function deletePromptConfirm() {
  console.log("Deleting", itemToDelete.value)
  dialog.value = false
}
</script>

<template>
  <v-main>
    <v-container>
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
                :title="`Edit ${item.name}`"
                append-icon="mdi-pencil"
                density="default"
                variant="tonal"
            >
              Edit
            </v-btn>
            <v-btn
                :title="`Delete ${item.name}`"
                append-icon="mdi-delete"
                density="default"
                variant="tonal"
                @click="deletePrompt(item.id, item.name)"
            >
              Delete
            </v-btn>
          </div>
        </template>
      </v-data-table-server>

      <!-- Delete confirm dialog -->
      <v-dialog v-model="dialog" max-width="300">
        <v-card
            title="Are you sure?"
            :subtitle="`Do you want to delete &quot;${itemToDelete?.name}&quot;`"
        >
          <template v-slot:text>
            <div class="d-flex flex-column ga-4">
              <p>
                If you are sure you want to delete the event
                "{{ itemToDelete?.name }}", then type <code>delete</code>
                into the text box.
              </p>
              <p>
                <strong>This action is not reversible</strong>
              </p>
              <v-text-field v-model="deleteConfirm" label="Confirm delete" placeholder="delete"/>
            </div>
          </template>

          <v-divider></v-divider>

          <v-card-actions class="bg-surface-light">
            <v-btn text="Cancel" @click="deletePromptCancel"></v-btn>

            <v-spacer></v-spacer>

            <v-btn text="Delete" variant="elevated" color="red-darken-1"
                   :disabled="deleteConfirm?.toLowerCase() != 'delete'" @click="deletePromptConfirm"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<style scoped>

</style>