<script setup lang="ts">
import { QDialog, QCard, QCardSection, QCardActions, QIcon, QBtn } from "quasar";

interface Props {
  favlistTitle: string;
  modelValue: boolean;
  persistent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  persistent: false,
});

const emit = defineEmits<{
  (e: "delete"): void;
  (e: "cancel"): void;
  (e: "update:modelValue", show: boolean): void;
}>();

const updateModelValue = (show: boolean) => {
  emit("update:modelValue", show);
};
</script>

<template>
  <QDialog
    :persistent="persistent"
    @update:modelValue="updateModelValue"
    :modelValue="modelValue"
  >
    <QCard>
      <QCardSection>
        <QIcon left name="sym_o_delete_forever" color="negative" size="md" />
        <span class="q-ml-sm"
          >This will delete {{ favlistTitle }} and all of its items permanently.</span
        >
      </QCardSection>
      <QCardActions>
        <QBtn flat color="grey" label="Cancel" @click="emit('cancel')" />
        <QBtn flat color="negative" label="Delete" @click="emit('delete')" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
