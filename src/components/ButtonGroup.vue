<script setup lang="ts">
import { ref } from "vue";

export interface Item {
  id: string;
  label: string;
}

export interface Props {
  items: Item[];
  modelValue: Item["id"];
}

const props = defineProps<Props>();

const selectedItem = ref<Item>(props.items[0]);

const emit = defineEmits<{
  (e: "update:modelValue", id: Item["id"]): void;
}>();
</script>

<template>
  <div class="flex items-center justify-center bg-white/10 rounded">
    <div
      :key="item.id"
      v-for="item in items"
      class="p-2"
      :class="{ 'bg-black/40': item.id === selectedItem.id }"
    >
      <input
        type="radio"
        v-model="selectedItem.id"
        class="hidden"
        :id="'item-' + item.id"
        :value="item.id"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
      <label
        :for="'item-' + item.id"
        class="cursor-pointer font-semibold"
        :class="{
          'text-purple-500 cursor-default': item.id === selectedItem.id,
        }"
        >{{ item.label.toUpperCase() }}</label
      >
    </div>
  </div>
</template>
