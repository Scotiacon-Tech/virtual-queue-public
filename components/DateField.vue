<script setup lang="ts">
const dayjs = useDayjs()

const model = defineModel<Date>()

const dialog = ref(false)
const value = ref<Date | null>(null)
const display = ref<string>("")

const props = defineProps<{
  name: string
  label: string
  errorMessages?: string | readonly string[] | null | undefined
}>();

function update(val: Date | undefined) {
  if (val) {
    display.value = dayjs(val).format("LL")
    value.value = val
  } else {
    display.value = ""
    value.value = null
  }
}

onMounted(() => {update(model.value)})
watch(model, update)

function ok() {
  if (value.value) {
    model.value = value.value;
  }
  dialog.value = false;
}
</script>

<template>
  <v-text-field
      :name="props.name"
      :model-value="display"
      :label="props.label"
      :error-messages="props.errorMessages"
      prepend-icon="mdi-calendar-outline"
      readonly
  >
    <v-dialog
        v-model="dialog"
        activator="parent"
        width="auto"
    >
        <v-date-picker show-adjacent-months v-model="value">
          <template v-slot:actions>
            <v-spacer></v-spacer>

            <v-btn @click="ok()">
              OK
            </v-btn>

            <v-btn @click="dialog = false">
              Cancel
            </v-btn>
          </template>
        </v-date-picker>
    </v-dialog>
  </v-text-field>
</template>

<style scoped>

</style>