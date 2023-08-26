import Vue, { reactive, computed } from 'vue';
import modelHoursFilter from '../models/hoursFilter.model'
import scheduleTypeModel from '../models/scheduleType.model';
import filters from '../models/filters.model'
import moment, { Moment } from 'moment';

interface State {
  showModal: boolean;
  titleModal: string;
  filters: any,
  form: any;
  loading: boolean;
  updateModal: boolean,
  scheduleType: string,
  selectedDate: string,
  startDateTime: string,
  endDateTime: string,
  fullDay: string,
  stationId: string
}

const state = reactive<State>({
    showModal: false,
    titleModal: '',
    filters,
    form: {},
    loading: false,
    updateModal: false,
    scheduleType: scheduleTypeModel[0].value,
    selectedDate: moment().format('YYYY/MM/DD'),
    startDateTime: '',
    endDateTime: '',
    fullDay: modelHoursFilter[0].value,
    stationId: ''
})

const store = computed(() => ({
    get showModal(): boolean {
        return state.showModal;
    },
    set showModal(value: boolean) {
        state.showModal = value;
    },
    get titleModal(): string {
        return state.titleModal;
    },
    set titleModal(value: string) {
        state.titleModal = value;
    },
    get loading(): boolean {
        return state.loading;
    },
    set loading(value: boolean) {
        state.loading = value;
    },
    get filters() {
        return state.filters;
    },
    set filters(data) {
        state.filters = {...data};
    },
    get form() {
      return state.form;
    },
    set form(data) {
      state.form = {...data};
    },
    get scheduleType() {
      return state.scheduleType;
    },
    set scheduleType(value: string) {
      state.scheduleType = value;
    },
    get selectedDate() {
      return state.selectedDate;
    },
    set selectedDate(value: string) {
      state.selectedDate = value;
    },
    get startDateTime() {
      return state.startDateTime;
    },
    set startDateTime(value: string) {
      state.startDateTime = value;
    },
    get endDateTime() {
      return state.endDateTime;
    },
    set endDateTime(value: string) {
      state.endDateTime = value;
    },
    get stationId() {
      return state.stationId;
    },
    set stationId(value: string) {
      state.stationId = value;
    },
    get filterTime(){
      if(state.form.time !== null){
        return state.form.time.split('-') || [0,0];
      }
      return state.fullDay.split('-');
    },
    get payload(){
      const filters = {...state.form};
      delete filters.time;
      delete filters.scheduleType;
      Object.keys(filters).forEach(
        (key) => (filters[key] === null) && delete filters[key]
      );
      return filters
    },
    reset(): void {
        //state.filters = {};
        state.showModal = false;
    },
})).value


export default store;
