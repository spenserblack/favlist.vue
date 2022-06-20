<script setup lang="ts">
import { ref } from 'vue';
import {
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

const $q = useQuasar();
$q.dark.set(true);

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
      </QToolbar>
    </QHeader>
    <QPageContainer>
      <QPage padding>
        <router-view @update:title="onTitleUpdate"></router-view>
      </QPage>
    </QPageContainer>
  </QLayout>
</template>
