<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  QBtn,

  QLayout,
  QHeader,
  QFooter,

  QToolbar,
  QToolbarTitle,

  QTabs,
  QTab,
  QRouteTab,

  QPageContainer,
  QPage,

  useQuasar,
} from 'quasar';
import { setWindowTitle } from './electron';
import { load as loadDarkMode, save as saveDarkMode } from './theme';

const $q = useQuasar();

$q.dark.set(loadDarkMode());
const isDark = computed({
  get: () => $q.dark.isActive,
  set: (value: boolean) => {
    $q.dark.set(value);
    saveDarkMode(value);
  },
});
const toggleDark = () => {
  isDark.value = !isDark.value;
};
const toggleDarkIcon = computed(() => `sym_o_${isDark.value ? 'light_mode' : 'dark_mode'}`);

const title = ref('Favlist');
const onTitleUpdate = (favlistTitle: string | null) => {
  let windowTitle = 'Favlist';
  let pageTitle = 'Favlist';
  if (favlistTitle != null) {
    windowTitle = `${favlistTitle} - ${windowTitle}`;
    pageTitle = favlistTitle;
  }
  setWindowTitle(windowTitle);
  title.value = pageTitle;
};
</script>

<template>
  <QLayout>
    <QHeader reveal>
      <QToolbar class="text-center">
        <QToolbarTitle>
          {{ title }}
        </QToolbarTitle>
        <QTabs shrink>
          <QRouteTab :to="{ name: 'home' }" icon="sym_o_home">Home</QRouteTab>
        </QTabs>
        <QBtn
            round
            dense
            flat
            :icon="toggleDarkIcon"
            @click="toggleDark"
        />
      </QToolbar>
    </QHeader>
    <QPageContainer>
      <QPage padding>
        <router-view @update:title="onTitleUpdate"></router-view>
      </QPage>
    </QPageContainer>
  </QLayout>
</template>
