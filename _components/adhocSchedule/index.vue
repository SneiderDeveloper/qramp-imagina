<template>
  <div>
    <kanbanBoard />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, onMounted, onBeforeUnmount } from "vue";
import kanbanBoard from "./components/kanbanBoard.vue";
import qRampStore from "../../_store/qRampStore";
import kanbanStore from './store/kanban.store'
import { router } from 'src/plugins/utils'
let routeName = router.route.path;

export default defineComponent({
  components: {
    kanbanBoard,
  },
  props: {
    isBlank: {
      type: Boolean,
      default: () => false,
    }
  },
  setup(props) {
    watch(() => router.route.path, (currentValue, oldValue) => {
        if (routeName !== currentValue) {
          routeName = currentValue;
          kanbanStore.columns.forEach(column => {
            column.cards = [];
          })
        }
      },
      { deep: true }
    );

    onMounted(() => {
      kanbanStore.isBlank = props.isBlank;
      qRampStore().setIsblank(props.isBlank);
    })
    onBeforeUnmount(() => {
      kanbanStore.search = null;
    })
    return {};
  },
});
</script>

<style scoped></style>
