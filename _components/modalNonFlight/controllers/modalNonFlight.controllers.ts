import Vue, { 
  computed, 
  ref, 
  toRefs, 
  ComputedRef, 
  WritableComputedRef, 
  getCurrentInstance,
  onBeforeUnmount 
} from "vue";
import store from '../store/index.store'
import { mergeColumnDateWithCurrentTime } from 'src/modules/qramp/_store/actions/mergeColumnDateWithCurrentTime'
import { fields } from '../models/fields';
import { NON_FLIGHT } from '../../model/constants';
import { listRequiredFields } from '../models/modelDefault/listRequiredFields'
import { saveWorkOrders } from '../services/saveNonFlight'
import { openModalFull } from 'src/modules/qramp/_store/actions/openModalFull'
import { getSearchByFlightNumber } from '../services/searchFlight'
import serviceListStore from '../../serviceList/store/serviceList';
import { cloneFlight } from '../actions/cloneFlight'

export default function controller(props: any, emit: any) {

  const proxy: any = getCurrentInstance()?.proxy
  const isLoadingSearch = ref(false)
  const listFlightsFound: any = ref([])
  const isOpenTableModal = ref(false)
  const loading: ComputedRef<boolean> = computed(() => store.loading);
  const { refFormOrders } = toRefs(props)
  const isShowButtonSave = computed(() => store.selectedTab === NON_FLIGHT)
  const actions = computed(() => [
    {
      props: {
        vIf: isShowButtonSave.value,
        color: 'primary',
        label: Vue.prototype.$tr('isite.cms.label.save'),
      },
      action: async () => {
        store.loading = true;
        await saveWorkOrderAndOpenIt()
        store.loading = false;
      }
    }
  ])
  const showModal: WritableComputedRef<boolean> = computed({
    get: () => store.showModal,
    set: (value: boolean) => {
      store.showModal = value;
    }
  });
  const titleModal: ComputedRef<string> = computed(() => store.titleModal);
  const widthModal: ComputedRef<string> = computed(() => store.widthModal);
  const form: any = computed(() => store.form);

  const isActiveNonFlightServices = computed(() => store.selectedTab === NON_FLIGHT)

  const handleModalChange = () => {
    store.showModal = true
  }

  const clear = () => {
    store.reset();
    proxy.$root.$emit('crud.data.refresh');
  }

  const showModalFull = async (workOrder, customProps?) => {
    openModalFull(refFormOrders.value, workOrder, customProps)

    isOpenTableModal.value = false;
    showModal.value = false;
  }

  const validateRequiredFields = () =>  {
    if (form.value.scheduleDate === 'Invalid date') form.value.scheduleDate = null
    return listRequiredFields.every(field => form.value[field])
  }

  const saveWorkOrderAndOpenIt = async () => {
    if (!validateRequiredFields()) return 
    const data = await saveWorkOrders()
    showModalFull(data)
    await emit('getWorkOrderFilter')
    store.reset()
  }

  const search = async () => {
    listFlightsFound.value = await getSearchByFlightNumber(form.value.flightNumber)
    isOpenTableModal.value = true
  }

  const flightSelect = async ({ select }) => {
    const clonedFlight = cloneFlight(select)
    const modalProps = {
      title: `Non-flight based on Work Order #${select.id}`,
      isClone: true,
    }
    const flight = {
      ...clonedFlight,
      scheduleDate: mergeColumnDateWithCurrentTime(),
    }
    await showModalFull(
      flight, 
      modalProps
    )
  }

  function zanetizeData(key: string) {
    if (key === "flightNumber") {
      form.value[key] = form.value[key]?.toUpperCase()?.replace(/\s+/g, "");
    }
  }
  onBeforeUnmount(() => {
    store.reset();
    serviceListStore().setErrorList([]);
    serviceListStore().setShowFavourite(false)
  })
  return { 
    listFlightsFound,
    loading,
    isLoadingSearch,
    isOpenTableModal,
    fields,
    form,
    isActiveNonFlightServices,
    showModal,
    widthModal,
    showModalFull,
    flightSelect,
    actions,
    search,
    clear,
    zanetizeData,
    titleModal,
    handleModalChange
  }
}
