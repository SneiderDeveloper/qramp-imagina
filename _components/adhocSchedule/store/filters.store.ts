import { reactive, computed } from 'vue';
import modelHoursFilter from '../models/hoursFilter.model'
import scheduleTypeModel from '../models/scheduleType.model';
import filterModel from '../models/filters.model'
import moment from 'moment';
import { State, ScheduleForm } from '../contracts/filtersStore.contract';
import storeKanban from '../store/kanban.store';

const state = reactive<State>({
  showModal: false,
  titleModal: 'Schedule Form',
  filters: filterModel(),
  form: {
    time: '0-23'
  },
  loading: false,
  updateModal: false,
  scheduleType: scheduleTypeModel[0].value,
  selectedDate: moment().format('YYYY/MM/DD'),
  startDateTime: '',
  endDateTime: '',
  fullDay: modelHoursFilter[0].value,
  showModalSchedule: false,
  titleFilter: '',
  scheduleForm: {
    airportId: null,
    airlineId: null,
    startDate: null,
    dateRange: null,
  },
  selectedTab: 1,
  adhocRuleId: null,
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
  get titleFilter(): string {
    return state.titleFilter;
  },
  set titleFilter(data: string) {
    state.titleFilter = data;
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
  set selectedDate(value: string | number | null) {
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
  get scheduleForm(): ScheduleForm {
    return state.scheduleForm;
  },
  set scheduleForm(value: ScheduleForm) {
    state.scheduleForm = value;
  },
  get showModalSchedule(){
    return state.showModalSchedule;
  },
  set showModalSchedule(value: boolean){
    state.showModalSchedule = value;
  },
  get selectedTab(){
    return state.selectedTab;
  },
  set selectedTab(value: number){
    state.selectedTab = value;
  },
  get filterTime(){
    if(state.form.time !== null){
      const TIME_DEFAULT = '0-23';
      storeKanban.isAppOffline && (state.form.time = TIME_DEFAULT);
      const filterTime = state.form.time.split('-') || [0,0];
      return filterTime;
    }
    return state.fullDay.split('-');
  },
  set adhocRuleId(value: number) {
    state.adhocRuleId = value;
  },
  get adhocRuleId(): number | null{
    return state.adhocRuleId;
  },
  get payload() {
    return {
      ...state.form,
      adhocRuleId: state.adhocRuleId,
    }
  },
  reset(): void {
    state.scheduleForm = {
      airportId: null,
      airlineId: null,
      startDate: null,
      dateRange: null,
    };
    state.showModal = false;
  },
})).value


export default store;
