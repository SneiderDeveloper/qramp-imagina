import {
  ref,
  computed,
  provide,
  watch,
  onMounted,
  onUnmounted
} from "vue";
import storeKanban from "../store/kanban.store";
import storeFilter from "../store/filters.store";
import modelHoursFilter from "../models/hoursFilter.model";
import qRampStore from "./../../../_store/qRampStore.js";
import buildKanbanStructure from "../actions/buildKanbanStructure";
import individualRefreshByColumns from "../actions/individualRefreshByColumns";
import checkUrlParams from "../actions/checkUrlParams";
import setUrlParams from "../actions/setUrlParams";
import getTitleFilter from "../actions/getTitleFilter";
import workOrderList from "modules/qramp/_store/actions/workOrderList";
import eventsKanban from '../actions/eventsKanban'
import validateMatchCompanyStation from "../actions/validateMatchCompanyStation";
import { store, i18n, helper, cache, router } from 'src/plugins/utils'
import { useQuasar } from 'quasar';
import { BUSINESS_UNIT_SECURITY, BUSINESS_UNIT_LABOR } from '../../model/constants.js';

export default function useKanbanBoard(props) {
  const { hasAccess } = store
  const $q = useQuasar()
  const refPageActions: any = ref(null);
  const loadingMain = ref(true);
  const refFormOrders = ref(null);
  const refModalNonFlight = ref(null);
  const isAppOffline = computed(() => store.state.qofflineMaster.isAppOffline)
  const search = computed({
    get: () => storeKanban.search,
    set: (value) => {
      storeKanban.search = value;
    }
  })
  provide("refFormOrders", refFormOrders);
  provide("refModalNonFlight", refModalNonFlight);
  const isPassenger = computed(() => qRampStore().getIsPassenger());
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
  const isSecurity = computed(() => qRampStore().getBusinessUnitId() === BUSINESS_UNIT_SECURITY);
  const title = computed(() => isPassenger.value ? 'Passenger Schedule' : 'Ramp Schedule')
  const selectedDate = computed(() => storeFilter.selectedDate);

  const scheduleType = computed({
    get: () => storeKanban.scheduleType,
    set: (value) => (storeKanban.scheduleType = value),
  });

  const groupOptions = { name: "kanban-columns" };

  const columns: any = computed({
    get: () => storeKanban.columns,
    set: (value) => (storeKanban.columns = value),
  });

  const scheduleTypeOptions = ref([
    {
      id: 2,
      label: i18n.tr("isite.cms.label.week"),
      value: "week-agenda",
      icon: "fas fa-calendar-week",
    },
    {
      id: 3,
      label: `${i18n.tr("isite.cms.label.day")}`,
      value: "day-agenda",
      icon: "fas fa-calendar-day",
    },
  ]);
  const extraPageActions = computed(() => {
    let extraActions: any = [
      'search',
      {
        label: "Copy Tiny URL",
        props: {
          icon: "fa-light fa-copy",
        },
        action: () => {
          const { routeName, hrefSplit } = determineRouteAndSplitHref()

          let tinyUrl =
            store.state.qsiteApp.originURL +
            `/#/${routeName}/schedule/public/index`;
          if (hrefSplit[1]) tinyUrl = tinyUrl + "?" + hrefSplit[1];
          helper.copyToClipboard(tinyUrl, "Tiny URL copied!");
        },
      },
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
        label: "Scheduler",
        vIf: hasAccess("ramp.schedulers.manage"),
        props: {
          label: "Scheduler",
          icon: "fa-light fa-calendar-plus",
        },
        action: () => {
          const { routeName, hrefSplit } = determineRouteAndSplitHref()
          let routeNameLocal = routeName

          if (qRampStore().getBusinessUnitId() ===  BUSINESS_UNIT_SECURITY) {
            routeNameLocal = "security";
          }
          let tinyUrl =
            store.state.qsiteApp.originURL +
            `/#/${routeNameLocal}/schedule/index`;
          if (hrefSplit[1]) tinyUrl = tinyUrl + "?" + hrefSplit[1];
          localStorage.setItem("urlSchedule", tinyUrl);
          router.push({ name: "qramp.admin.scheduler" });
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
  };
  async function setStations() {
    const params = { ...router.route.query };
    const localStationId =
      (await cache.get.item("stationId")) !== "null"
        ? await cache.get.item("stationId")
        : null;
    storeFilter.stationId =
      getStationAssigned(store.state.quserAuth.userData) ||
      params.stationId ||
      localStationId ||
      null;
    storeFilter.form.stationId = storeFilter.stationId;

    const station = await workOrderList()
      .getStationList()
      .find((item) => {
        return validateMatchCompanyStation(item)
      });

    if (!station || !storeFilter.stationId) {
      storeFilter.stationId = null;
      storeFilter.showModalStation = true;
      return;
    }
  }
  function getStationAssigned(userData) {
    try {
      let stationsAssigned = null;
      if (userData) {
        if (userData.options) {
          if (
            userData.options.stationsAssigned &&
            Array.isArray(userData.options.stationsAssigned) &&
            userData.options.stationsAssigned.length > 0
          ) {
            stationsAssigned = userData.options.stationsAssigned.shift();
          }
        }
      }
      return stationsAssigned;
    } catch (error) {
      console.log(error);
    }
  }
  async function changeSearch(searchData = null) {
    search.value = searchData;
    await buildKanbanStructure(true);
  }

  function determineRouteAndSplitHref() {
    let routeName = isPassenger.value ? "passenger" : "ramp";
    if(qRampStore().getBusinessUnitId() === BUSINESS_UNIT_LABOR) {
      routeName = "labor";
    }
    let hrefSplit = window.location.href.split("?");

    return { routeName, hrefSplit }
  }

  onMounted(async() => {
    await setStations()
    await init()
    loadingMain.value = false;
  });
  watch(
    () => router.route,
    async (currentValue, oldValue) => {
      const newPath = currentValue.path
      const oldPath = oldValue.path
      if (newPath !== oldPath) {
        workOrderList().setStationList([]);
        storeFilter.stationId = null;
        storeFilter.showModalStation = true;
        refPageActions.value.search = null;
        storeKanban.search = null;
      }
      if(storeFilter.stationId === null) {
        storeFilter.showModalStation = true;
        return;
      }

      if (!storeKanban.loading) {
        await init();
      }
    },
    { deep: true }
  );
  watch(isAppOffline, async(newValue, oldValue) => {
    storeKanban.isAppOffline = newValue;
    await setStations()
    await init()
  })
  onUnmounted(() => {
    storeKanban.columns = [];
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
    refFormOrders,
    refModalNonFlight,
    individualRefreshByColumns,
    title,
    isAppOffline,
    storeFilter,
    loadingMain,
    search,
    changeSearch,
    refPageActions,
    isSecurity
  };
}
