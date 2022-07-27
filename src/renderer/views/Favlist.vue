<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getFavlist,
  deleteFavlist,
  addColumn as addDbColumn,
  editColumn as editDbColumn,
  deleteColumn as deleteDbColumn,
  addRow as addDbRow,
  editRow as editDbRow,
  deleteRow as deleteDbRow,
  setWindowTitle,
} from '../electron';
import {
  QTable,
  QTr,
  QTh,
  QTd,

  QBtn,

  QDialog,

  QCard,
  QCardSection,
  QCardActions,

  QForm,
  QInput,

  QIcon,
} from 'quasar';
import DeleteConfirmation from '../components/DeleteConfirmation.vue';
import DoubleCheckBtn from '../components/DoubleCheckBtn.vue';

const route = useRoute();
const router = useRouter();

const id = computed((): number => route.params.id);

const table = ref<QTable>(null);

const favlist = ref<Favlist | null>(null);
const title = computed((): string => favlist.value?.title ?? '<unknown>');

const columns = computed((): Column[] => favlist
  .value?.columns
  .map(({ id, name }) => ({
    name: id, // That's confusing 😅
    label: name,
    field: (row) => row[id],
    align: 'center',
  }))
  ?? []);
const addColumn = async () => {
  const list = favlist.value;
  if (list == null) {
    console.error('favlist is null');
    return;
  }
  const column = await addDbColumn(list.id);
  list.columns.push(column);
  // TODO Get value from DB instead of hardcoding?
  list.rows.forEach((row) => row[column.id] = '---');
};

// NOTE Index of the column to be edited
const columnToBeEdited = ref<number | null>(null);
const columnNameInput = ref('');
const showEditColumnDialog = ref(false);
const onColumnClick = (index: number) => {
  const column = columns.value[index];
  columnToBeEdited.value = index;
  showEditColumnDialog.value = true;
  columnNameInput.value = column.label;
};
const editColumn = async () => {
  const column = columns.value[columnToBeEdited.value];
  const { name } = await editDbColumn(column.name, columnNameInput.value);
  favlist.value.columns[columnToBeEdited.value].name = name;
  columnToBeEdited.value = null;
  showEditColumnDialog.value = false;
};
const deleteColumn = async () => {
  const list = favlist.value;
  const column = list.columns[columnToBeEdited.value];
  await deleteDbColumn(column.id);
  list.columns.splice(columnToBeEdited.value, 1);
  list.rows.forEach((row) => delete row[column.id]);
  columnToBeEdited.value = null;
  showEditColumnDialog.value = false;
};

const rows = computed((): Row[] => favlist.value?.rows ?? []);
const addRow = async () => {
  const list = favlist.value;
  if (list == null) {
    console.error('favlist is null');
    return;
  }
  const row = await addDbRow(list.id);
  // TODO Data from cells
  list.rows.push(row);
  table.value?.lastPage();
};
const rowToBeEdited = ref<number | null>(null);
const rowEditValues = ref<string[]>([]);
const showEditRowDialog = ref(false);
const onRowClick = (_evt: unknown, row: Row, index: number) => {
  rowToBeEdited.value = index;
  showEditRowDialog.value = true;
  rowEditValues.value = columns.value.map(({ name }) => row[name]);
};
const editRow = async () => {
  const row = rows.value[rowToBeEdited.value];
  const values = rowEditValues.value.reduce((values: Record<string | number, string>, value, index) => {
    const column = columns.value[index];
    values[column.name] = value;
    return values;
  }, {});
  const list = favlist.value;
  if (list == null) {
    console.error('favlist is null');
    return;
  }
  const newRow = await editDbRow(row.id, values);
  list.rows[rowToBeEdited.value] = newRow;
  rowToBeEdited.value = null;
  showEditRowDialog.value = false;
};
const deleteRow = async () => {
  const row = rows.value[rowToBeEdited.value];
  await deleteDbRow(row.id);
  favlist.value.rows.splice(rowToBeEdited.value, 1);
  rowToBeEdited.value = null;
  showEditRowDialog.value = false;
};

const showDeleteConfirmation = ref(false);
const deleteList = async () => {
  // NOTE Favlist must exist if button is visible
  await deleteFavlist(favlist.value.id);
  router.push({ name: 'home' });
};

const emit = defineEmits<{
  (e: 'update:title', title: string): void
}>();

onMounted(async () => {
  favlist.value = await getFavlist(id.value);
  emit('update:title', title.value);
});
</script>

<template>
  <QTable
    v-bind="$attrs"
    :title="favlist?.title ?? '...'"
    :columns="columns"
    :rows="rows"
    row-key="id"
    dark
    color="primary"
    @rowClick="onRowClick"
    ref="table"
  >
    <template #top-left>
      <QBtn color="primary" label="Add column" @click="addColumn" />
    </template>
    <template #top-right>
      <QBtn
        color="negative"
        label="Delete"
        icon="sym_o_delete_forever"
        @click="showDeleteConfirmation = true"
      />
    </template>
    <template #header="props">
      <QTr :props="props">
        <QTh v-for="(col, colIndex) in props.cols" :key="col.name">
          <QBtn
            :label="col.label"
            flat
            no-caps
            @click="onColumnClick(colIndex)"
          />
        </QTh>
      </QTr>
    </template>
  </QTable>

  <div class="row q-mt-sm">
    <div class="col">
      <QBtn class="full-width" color="primary" label="Add row" @click="addRow" />
    </div>
  </div>

  <DeleteConfirmation
    v-model="showDeleteConfirmation"
    @delete="deleteList"
    @cancel="showDeleteConfirmation = false"
    :favlistTitle="title"
  />

  <QDialog
    id="edit-column-dialog"
    v-model="showEditColumnDialog"
  >
    <QCard>
      <QForm @submit="editColumn">
        <QCardSection>
          <div class="text-h6">
            <QIcon left name="sym_o_edit" /> Edit {{ columns[columnToBeEdited].label }}
          </div>
        </QCardSection>
        <QCardSection>
          <QInput
            v-model="columnNameInput"
            label="Name"
            autofocus
            dense
          />
        </QCardSection>
        <QCardActions>
          <QBtn flat color="grey" label="Cancel" @click="showEditColumnDialog = false" />
          <QBtn flat color="primary" label="Save" type="submit" />
          <DoubleCheckBtn flat color="negative" label="Delete" @confirm="deleteColumn" />
        </QCardActions>
      </QForm>
    </QCard>
  </QDialog>

  <QDialog
    id="edit-row-dialog"
    v-model="showEditRowDialog"
  >
    <QCard>
      <QForm @submit="editRow">
        <QCardSection>
          <div class="text-h6">
            <QIcon left name="sym_o_edit" /> Edit row
          </div>
        </QCardSection>
        <QCardSection>
          <QInput
            v-for="(value, index) in rowEditValues"
            :key="index"
            v-model="rowEditValues[index]"
            :label="columns[index].label"
            dense
          />
        </QCardSection>
        <QCardActions>
          <QBtn flat color="grey" label="Cancel" @click="showEditRowDialog = false" />
          <QBtn flat color="primary" label="Save" type="submit" />
          <DoubleCheckBtn flat color="negative" label="Delete" @confirm="deleteRow" />
        </QCardActions>
      </QForm>
    </QCard>
  </QDialog>
</template>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
