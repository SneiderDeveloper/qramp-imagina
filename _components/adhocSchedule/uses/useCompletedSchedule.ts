import { computed } from 'vue';
import storeKanban from '../store/kanban.store'
import { i18n } from 'src/plugins/utils'

export default function useCompletedSchedule(props: any, emit: any) {
  const isBlank = computed(() => storeKanban.isBlank);
  const scheduleType = computed(() => props.scheduleType);
  const cards = computed(() => props.column.cards)

  function refresh() {
    emit('refresh');
  }
  
  return {
    scheduleType,
    refresh,
    isBlank,
    cards,
    i18n
  }
}
