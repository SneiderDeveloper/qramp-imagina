import {computed, reactive} from "vue";
import { 
  NON_FLIGHT, 
  OPERATION_TYPE_NON_FLIGHT,
  BUSINESS_UNIT_PASSENGER,
  BUSINESS_UNIT_SECURITY 
} from "../../model/constants";
import qRampStore from 'src/modules/qramp/_store/qRampStore'
import { mergeColumnDateWithCurrentTime } from '../actions/mergeColumnDateWithCurrentTime'
import { Form, Store } from '../contracts'

const state = reactive<Store>({
  selectedTab: 1,
  isLoadingSearch: false,
  showModal: false,
  loading: false,
  widthModal: '35vw',
  isOpenTableModal: false,
  form: {
    flightNumber: '',
    customerId: null,
    stationId: null,
    scheduleDate: null,
    responsibleId: null,
    operationTypeId: null,
    preFlightNumber: null,
  },
  seletedDateColumn: null,
  stationId: null,
})

const getOperationTypeId = () => {
  const businessUnitId = qRampStore().getBusinessUnitId()
  if (businessUnitId === BUSINESS_UNIT_PASSENGER) return OPERATION_TYPE_NON_FLIGHT[0]
  if (businessUnitId === BUSINESS_UNIT_SECURITY) return OPERATION_TYPE_NON_FLIGHT[1]
}

export default computed(() => ({
  get selectedTab() {
    return state.selectedTab
  },
  set selectedTab(value) {
    state.selectedTab = value
  },
  get isLoadingSearch() {
    return state.isLoadingSearch
  },
  set isLoadingSearch(value) {
    state.isLoadingSearch = value
  },
  get showModal(): boolean {
    return state.showModal;
  },
  set showModal(value: boolean) {
    state.showModal = value;
  },
  get loading(): boolean {
    return state.loading;
  },
  set loading(value: boolean) {
    state.loading = value;
  },
  get widthModal(): string {
    return state.widthModal;
  },
  set widthModal(value: string) {
      state.widthModal = value;
  },
  get isOpenTableModal(): boolean {
    return state.isOpenTableModal;
  },
  set isOpenTableModal(value: boolean) {
    state.isOpenTableModal = value;
  },
  get form(): Form {
    return state.form;
  },
  set form(value: Form) {
    state.form = value;
  },
  get seletedDateColumn() {
    return mergeColumnDateWithCurrentTime(state.seletedDateColumn);
  },
  set seletedDateColumn(value) {
    state.seletedDateColumn = value;
  },
  get stationId() {
    return state.stationId
  },
  set stationId(value) {
    state.stationId = value
  },
  payload() {
    const businessUnitId = qRampStore().getBusinessUnitId()
    
    return { 
      ...state.form,  
      businessUnitId,
      type: NON_FLIGHT,
      operationTypeId: getOperationTypeId(),
      titleOffline: 'New non-flight',
    };
  },
  reset() {
    state.selectedTab = 1
    state.isLoadingSearch = false
    state.showModal = false
    state.loading = false
    state.widthModal = '35vw'
    state.form = {
      flightNumber: '',
      customerId: null,
      stationId: null,
      scheduleDate: null,
      responsibleId: null,
      operationTypeId: null,
      preFlightNumber: null,
    } 
    state.seletedDateColumn = null
    state.stationId = null
  }
})).value
