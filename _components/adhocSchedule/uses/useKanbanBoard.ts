import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';
import storeKanban from '../store/kanban.store';
import storeFilter from '../store/filters.store';
import modelHoursFilter from '../models/hoursFilter.model';
import buildKanbanStructure from '../actions/buildKanbanStructure';
import individualRefreshByColumns from '../actions/individualRefreshByColumns';
import checkUrlParams from '../actions/checkUrlParams';
import setUrlParams from '../actions/setUrlParams';
import getTitleFilter from '../actions/getTitleFilter';
import eventsKanban from '../actions/eventsKanban'
import { store, i18n, router, eventBus, cache } from 'src/plugins/utils'
import { useQuasar } from 'quasar';
import kanbanStore from '../store/kanban.store';
import scheduleTypeOptions from '../models/scheduleType.model'

export default function useKanbanBoard(props) {
  const $q = useQuasar()
  const refPageActions: any = ref(null);
  const loadingMain = ref(true);
  const isAppOffline = computed(() => store.state.qofflineMaster.isAppOffline)
  const search = computed({
    get: () => storeKanban.search,
    set: (value) => {
      storeKanban.search = value;
    }
  })
  const isDraggingCard = computed(() => storeKanban.isDraggingCard);
  const fullscreen = ref(false);
  const filterTime = ref(null);
  const dynamicFieldTime = ref({
    value: null,
    type: "select",
    props: {
      label: "Filter by time",
      format24h: true,
      options: modelHoursFilter,
    },
  });
  const title = computed(() => kanbanStore.title);
  const scheduleRule = computed(() => ([
    {
      label: 'Airport',
      value: storeKanban.scheduleRule?.airport.airportIataCode,
    },
    {
      label: 'Airline',
      value: storeKanban.scheduleRule?.airline.airlineShortName,
    }
  ]))
  const selectedDate = computed(() => storeFilter.selectedDate);
  const showModalSchedule = computed(() => storeFilter.showModalSchedule);
  const scheduleType = computed({
    get: () => storeKanban.scheduleType,
    set: (value) => (storeKanban.scheduleType = value),
  });

  const groupOptions = { name: "kanban-columns" };

  const columns: any = computed({
    get: () => storeKanban.columns,
    set: (value) => (storeKanban.columns = value),
  });

  const extraPageActions = computed(() => {
    let extraActions: any = [
      'search',
      {
        label: i18n.tr("isite.cms.configList.fullScreen", {
          capitalize: true,
        }),
        props: {
          icon: fullscreen.value ? "fa-light fa-compress" : "fa-light fa-expand",
        },
        action: () => {
          fullscreen.value = !fullscreen.value;
          $q.fullscreen.toggle();
        },
      },
      {
        label: "Create schedule",
        props: {
          label: "Create schedule",
          icon: "fa-light fa-calendar-circle-plus",
        },
        action: () => {
          storeKanban.showModalCreateSchedule = true;
        },
      },
      {
        label: "Schedule history",
        props: {
          label: "Schedule history",
          icon: "fa-light fa-clock-rotate-left",
        },
        action: () => {
          storeKanban.showModalHistory = true;
        },
      },
      {
        label: i18n.tr("isite.cms.label.filter"),
        vIf: !isAppOffline.value,
        props: {
          icon: "fa-light fa-filter",
          id: "filter-button-crud",
        },
        action: () => {
          storeFilter.showModal = true;
        },
      },
    ];

    return extraActions;
  });

  const init = async () => {
    eventsKanban().cardRefresh();
    await checkUrlParams();
    storeKanban.scheduleType = storeFilter.scheduleType;
    storeKanban.isAppOffline = store.state.qofflineMaster.isAppOffline
    getTitleFilter();
    await setUrlParams();
    await buildKanbanStructure();

    eventBus.on('adHocScheduleDone', async (data) => {
      const adhocRuleId = Number(storeFilter.adhocRuleId)
      const ruleId = Number(data?.ruleId)

      if (adhocRuleId === ruleId) {
        getTitleFilter()
        await setUrlParams()
        await buildKanbanStructure()
        storeFilter.showModalSchedule = false;
        storeKanban.showModalCreateSchedule = false;
        storeFilter.loading = false;
      }

    })
  };
  async function changeSearch(searchData = null) {
    search.value = searchData;
    await buildKanbanStructure(true);
  }

  async function setAdhocRuleId() {
    const params = { ...router.route.query }
    const localAdhocRuleId = Number(await cache.get.item("adhocRuleId"))
    const paramsAdhocRuleId = Number(params.adhocRuleId)

    const adhocRuleId = paramsAdhocRuleId || localAdhocRuleId

    if (Boolean(adhocRuleId)) {
      storeFilter.adhocRuleId = adhocRuleId;
      storeFilter.form.adhocRuleId = adhocRuleId;
    } else {
      storeFilter.showModalSchedule = true;
    }
  }

  onMounted(async() => {
    await setAdhocRuleId()
    await init()
    loadingMain.value = false;
  });

  watch(isAppOffline, async(newValue, oldValue) => {
    storeKanban.isAppOffline = newValue;
    await init()
  })

  onUnmounted(() => {
    storeKanban.columns = [];
    storeFilter.showModalSchedule = false;
    eventBus.off('adHocScheduleDone');
  })
  return {
    selectedDate,
    columns,
    groupOptions,
    scheduleTypeOptions,
    scheduleType,
    filterTime,
    dynamicFieldTime,
    extraPageActions,
    isDraggingCard,
    buildKanbanStructure,
    individualRefreshByColumns,
    title,
    isAppOffline,
    storeFilter,
    loadingMain,
    search,
    changeSearch,
    refPageActions,
    showModalSchedule,
    scheduleRule,
  };
}
