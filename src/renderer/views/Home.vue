<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import {
  allFavlists,
  addFavlist,
  deleteFavlist,
  electronMessage,
} from '../electron'
import {
  QList,
  QItem,
  QItemSection,
  QItemLabel,

  QBtn,
  QForm,
  QInput,
} from 'quasar';
import DeleteConfirmation from '../components/DeleteConfirmation.vue';

const favlists = ref([]);
const title = ref('');
const newList = async () => {
  if (!title.value) {
    return;
  }
  const favlist = await addFavlist(title.value);
  electronMessage(`Created list "${title.value}"`);
  title.value = '';
  favlists.value.push(favlist);
};
const deleteOption = ref(null);
const showDeleteDialog = computed(() => deleteOption.value != null);
const deleteList = async () => {
  const index = deleteOption.value;
  const favlist = favlists.value[index];
  await deleteFavlist(favlist.id);
  electronMessage(`Deleted list "${favlist.title}"`);
  favlists.value.splice(index, 1);
  deleteOption.value = null;
};

const emit = defineEmits<{
  (e: 'update:title', title: string): void
}>();

onMounted(async () => {
  emit('update:title', null);
  favlists.value = await allFavlists();
});
</script>

<template>
  <QList v-bind="$attrs">
    <QItem dark>
      <QItemSection side>
        <QBtn
          id="new-list-btn"
          color="positive"
          icon="sym_o_add"
          :disabled="!title"
          @click="newList"
          aria-label="New list"
        />
      </QItemSection>
      <QItemSection>
        <QForm @submit="newList">
          <QInput
            for="new-list-title"
            type="text"
            dark
            filled
            label="Add a list"
            v-model="title"
          />
        </QForm>
      </QItemSection>
    </QItem>
    <QItem
      v-for="(favlist, index) in favlists"
      clickable
      v-ripple
      dark
      :key="favlist.id"
    >
      <QItemSection side>
      <QBtn
        color="negative"
        class="delete-list-btn"
        icon="sym_o_delete_forever"
        :aria-label="`Remove ${favlist.title}`"
        @click="deleteOption = index"
      />
      </QItemSection>
      <QItemSection>
        <router-link
          class="text-h5 text-primary favlist-link"
          :to="{ name: 'favlist', params: { id: favlist.id } }"
        >{{ favlist.title }}</router-link>
      </QItemSection>
    </QItem>
  </QList>

  <DeleteConfirmation
    persistent
    v-model="showDeleteDialog"
    :favlistTitle="favlists[deleteOption]?.title ?? '<unknown>'"
    @delete="deleteList"
    @cancel="deleteOption = null"
  />
</template>
