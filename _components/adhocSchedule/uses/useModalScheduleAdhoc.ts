import { ref, computed, onUnmounted } from 'vue';
import store from '../store/filters.store'
import modalScheduleFields from '../models/modalSchedule.model';
import storeKanban from '../store/kanban.store';
import { createSchedule } from '../actions/createSchedule'

export default function useModalScheduleAdhoc() {
  const SEE_HISTORICAL_SCHEDULES = 1
  const CREATE = 2
  const refModalStation: any = ref(null);
  const selectedTab = ref(SEE_HISTORICAL_SCHEDULES);
  const fields = computed(() => {
    return modalScheduleFields().fields.value
  });
  const loading = computed({
    get: () => store.loading,
    set: value => store.loading = value,
  });

  const title = computed(() => store.titleModal);

  const showModalSchedule = computed({
    get: () => store.showModalSchedule,
    set: (value) => (store.showModalSchedule = value),
  });

  const scheduleForm = computed({
    get: () => store.scheduleForm,
    set: (value) => (store.scheduleForm = value),
  });

  const isCreate = computed(() => selectedTab.value === CREATE)

  const actions = computed(()=> {
    return [
      {
        props: {
          color: 'secondary',
          label: isCreate.value ? 'Create' : 'See all',
          vIf: !loading.value,
        },
        action: async () => {
          if (!isCreate.value) {
            openHistoryModal();
            return
          }
          if (isCreate.value) {
            await createSchedule(refModalStation.value);
          }
        },
      },
    ];
  })

  const tapOptions = computed(() => {
    return [
      {
        label: 'Choose created schedule',
        value: SEE_HISTORICAL_SCHEDULES,
      },
      {
        label: 'New schedule',
        value: CREATE
      },
    ]
  })

  const openHistoryModal = () => {
    store.showModalSchedule = false;
    storeKanban.showModalHistory = true;
  }

  const handleChangesTab = (value) => {
    selectedTab.value = value;
  }

  const handleCloseModal = () => {
    loading.value = false;
  }

  onUnmounted(() => {
    store.showModalSchedule = false;
  })

  return {
    loading,
    showModalSchedule,
    scheduleForm,
    actions,
    fields,
    refModalStation,
    tapOptions,
    selectedTab,
    handleChangesTab,
    handleCloseModal,
    isCreate,
    title,
    CREATE,
  };
}
