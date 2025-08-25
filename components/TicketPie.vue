<script setup lang="ts">
const model = defineModel<{
  inQueue: number,
  onHold: number,
  active: number,
  used: number
}>()

interface PieItem {
  key: string | number | symbol;
  color: string;
  value: number;
  title: string;
  pattern?: string;
  raw?: Record<string, any>;
}

const items = ref<PieItem[]>([])

function update() {
  if (model.value) {
    const {inQueue, onHold, active, used} = model.value
    items.value = [
      {key: 'inQueue', title: 'In Queue', value: inQueue, color: '#47a'},
      {key: 'onHold', title: 'On Hold', value: onHold, color: '#a37'},
      {key: 'active', title: 'Active', value: active, color: '#283'},
      {key: 'used', title: 'Used', value: used, color: '#cb4'},
    ]
  } else {
    items.value = []
  }
}

update();
watch(model, () => {update()})
</script>

<template>
  <v-pie
      :items="items"
      :legend="{position: 'top'}"
      :tooltip="{ subtitleFormat: '[value]' }"
      class="pa-3 justify-center"
      gap="4"
      inner-cut="70"
      rounded="2"
      size="300"
      animation
      hide-slice
      reveal
  >
    <template v-slot:center="{ total }">
      <div class="text-center">
        <div class="text-h3">{{ total }}</div>
        <div class="opacity-70 mt-1 mb-n1">Total</div>
      </div>
    </template>

    <template v-slot:legend="{ items, toggle, isActive }">
      <v-list class="py-0 mb-n5 mb-md-0 bg-transparent" density="compact" width="300">
        <v-list-item
            v-for="item in items"
            :key="item.key"
            :class="['my-1', { 'opacity-40': !isActive(item) }]"
            :title="item.title"
            rounded="lg"
            link
            @click="toggle(item)"
        >
          <template v-slot:prepend>
            <v-avatar :color="item.color" :size="16"></v-avatar>
          </template>
          <template v-slot:append>
            <div class="font-weight-bold">{{ item.value }}</div>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-pie>
</template>

<style scoped>

</style>