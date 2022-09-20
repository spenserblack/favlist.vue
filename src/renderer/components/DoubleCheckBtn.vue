<script setup lang="ts">
import { ref, computed } from "vue";
import { QBtn } from "quasar";

interface Props {
  label?: string | number;
  confirmText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: "Are you sure?",
});

const emit = defineEmits<{
  (e: "click"): void;
  (e: "confirm"): void;
}>();

const clicked = ref(false);

const onClick = () => {
  emit("click");
  if (clicked.value) {
    emit("confirm");
  } else {
    clicked.value = true;
  }
};

const buttonLabel = computed(() => {
  if (clicked.value) {
    return props.confirmText;
  } else {
    return props.label;
  }
});
</script>

<template>
  <QBtn :label="buttonLabel" @click="onClick" />
</template>
