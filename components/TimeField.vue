<script setup lang="ts">
const dayjs = useDayjs()

const model = defineModel<string>()

const dialog = ref(false)
const value = ref<string | null>(null)

const props = defineProps<{
  name: string
  label: string
  errorMessages?: string | readonly string[] | null | undefined
}>();

const display = ref<string | null>(null)

function update(val: string | undefined) {
  if (val) {
    display.value = dayjs(val, 'HH:mm').format("LT")
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
      prepend-icon="mdi-clock-time-four-outline"
      readonly
  >
    <v-dialog
        v-model="dialog"
        activator="parent"
        width="auto"
    >
        <v-time-picker v-model="value">
          <template v-slot:actions>
            <v-spacer></v-spacer>

            <v-btn @click="ok()">
              OK
            </v-btn>

            <v-btn @click="dialog = false">
              Cancel
            </v-btn>
          </template>
        </v-time-picker>
     </v-dialog>
  </v-text-field>
</template>

<style scoped>

</style>