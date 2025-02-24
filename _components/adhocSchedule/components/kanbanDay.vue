<template>
  <div>
    <component
      :is="cardComponentName"
      cardComponentName
      :id="card.id"
      :key="card.id"
      :card="card"
      :dateColumn="dateColumn"
    />
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import useKanbanCardActions from '../uses/useKanbanCardActions';
import kanbanCardTablet from './kanbanCardTablet.vue';
import kanbanCardDesktop from './kanbanCardDesktop.vue';

export default defineComponent({
  components: {
    kanbanCardTablet,
    kanbanCardDesktop
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
    dateColumn: {
      type: String,
      default: () => null
    }
  },
  setup(props) {
    return {...useKanbanCardActions(props)}
  },
});
</script>
<style scoped>
</style>
