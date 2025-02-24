import { ref, computed, onUnmounted } from 'vue';
import store from '../store/filters.store'
import modalScheduleFields from '../models/modalSchedule.model';
import storeKanban from '../store/kanban.store';
import { createSchedule } from '../actions/createSchedule';

export default function useModalCreateSchedule() {
  const refModalStation: any = ref(null);
  const fields = computed(() => {
    return modalScheduleFields().fields.value
  });
  const loading = computed({
    get: () => store.loading,
    set: value => store.loading = value,
  });

  const showModalCreateSchedule = computed({
    get: () => storeKanban.showModalCreateSchedule,
    set: (value) => (storeKanban.showModalCreateSchedule = value),
  });

  const scheduleForm = computed({
    get: () => store.scheduleForm,
    set: (value) => (store.scheduleForm = value),
  });

  const actions = computed(()=> {
    return [
      {
        props: {
          color: "secondary",
          label: "Create",
          vIf: !loading.value,
        },
        action: async () => {
          await createSchedule(refModalStation.value);
        },
      },
    ];
  })

  const handleCloseModal = () => {
    loading.value = false;
  }

  onUnmounted(() => {
    store.showModalSchedule = false;
  })

  return {
    loading,
    showModalCreateSchedule,
    scheduleForm,
    actions,
    fields,
    refModalStation,
    handleCloseModal,
  };
}
