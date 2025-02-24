import { reactive, computed } from 'vue';
import moment from 'moment';
import { Columns, State, ScheduleRule } from '../contracts/kanbanStore.contract'
import qRampStore from 'modules/qramp/_store/qRampStore';

const state: State = reactive({
  selectedDate: moment().format('YYYY/MM/DD'),
  scheduleType: 'week-agenda',
  isDraggingCard: false,
  columns: [],
  statusIdList: [],
  loading: false,
  dragDate: '',
  isBlank: false,
  isAppOffline: false,
  search: null,
  title: 'Adhoc Schedule',
  showModalHistory: false,
  showModalCreateSchedule: false,
  scheduleRule: {
    airline: {
      airlineShortName: null,
    },
    airport: {
      airportIataCode: null,
    },
  }
});

const store: State = computed(() => ({
  get title(): string {
    return state.title;
  },
  set title(value: string) {
    state.title = value;
  },
  get scheduleType(): string {
    return state.scheduleType;
  },
  set scheduleType(value: string) {
    state.scheduleType = value;
  },
  get isDraggingCard(): boolean {
    return state.isDraggingCard;
  },
  set isDraggingCard(value: boolean) {
    state.isDraggingCard = value;
  },
  get columns(): Columns[] {
    return state.columns;
  },
  set columns(value: Columns[]) {
    state.columns = value;
  },
  get statusIdList(): number[] | null {
    return state.statusIdList;
  },
  set statusIdList(value: number[] | null) {
    state.statusIdList = value;
  },
  get loading(): boolean {
    return state.loading;
  },
  set loading(value: boolean) {
    state.loading = value;
  },
  get dragDate(): string {
    return state.dragDate;
  },
  set dragDate(value: string) {
    state.dragDate = value;
  },
  get isBlank(): boolean {
    return state.isBlank;
  },
  set isBlank(value: boolean) {
    state.isBlank = value;
  },
  get isAppOffline(): boolean {
    return state.isAppOffline;
  },
  set isAppOffline(value: boolean) {
    state.isAppOffline = value;
  },
  get filterCompany(): any {
    return qRampStore().getFilterCompany();
  },
  get search(): string | null {
    return state.search;
  },
  set search(value: string | null) {
    state.search = value;
  },
  get showModalHistory(): boolean {
    return state.showModalHistory;
  },
  set showModalHistory(value: boolean) {
    state.showModalHistory = value;
  },
  get showModalCreateSchedule(): boolean {
    return state.showModalCreateSchedule;
  },
  set showModalCreateSchedule(value: boolean) {
    state.showModalCreateSchedule = value;
  },
  set scheduleRule(value: ScheduleRule | null) {
    state.scheduleRule = value;
  },
  get scheduleRule(): ScheduleRule | null{
    return state.scheduleRule;
  },
})).value;

export default store;
