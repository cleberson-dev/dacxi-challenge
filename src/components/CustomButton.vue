<script setup lang="ts">
export interface Props {
  title: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "click"): void;
}>();

const classes = `
  disabled:opacity-40 disabled:cursor-default
  font-semibold cursor-pointer mt-2 bg-blue-500 text-black px-4 py-1 rounded
`;
</script>

<template>
  <button :class="classes" @click="$emit('click')" :disabled="disabled">
    {{ title }}
  </button>
</template>
