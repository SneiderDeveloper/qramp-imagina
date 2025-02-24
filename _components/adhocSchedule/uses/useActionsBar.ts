import { computed } from "vue";
import buildKanbanStructure from "../actions/buildKanbanStructure";
import storeFilters from "../store/filters.store";
import moment from "moment";
import getTitleFilter from "../actions/getTitleFilter";
import setUrlParams from "../actions/setUrlParams";
import storeKanban from "../store/kanban.store";
import scheduleTypeModel from "../models/scheduleType.model";

export default function useActionsBar(props: any) {
  const DATE_FORMAT = "YYYY/MM/DD";
  const selectedDate = computed(
    () => moment(storeFilters.selectedDate, DATE_FORMAT)
  );
  const titleFilter = computed(() => storeFilters.titleFilter);
  const isWeekAgenda = computed(() => storeKanban.scheduleType == scheduleTypeModel[0].value );
  async function changeDate(offset: number): Promise<void> {
    const dayMultiplier = storeFilters.scheduleType === scheduleTypeModel[0].value ? 7 : 1;
    const adjustedOffset = dayMultiplier * offset;

    storeFilters.selectedDate = selectedDate.value
      .add(adjustedOffset, "days")
      .format(DATE_FORMAT);
    await setUrlParams();
    await buildKanbanStructure();
  }

  async function next(): Promise<void> {
    await changeDate(1);
    getTitleFilter()
  }

  async function back(): Promise<void> {
    await changeDate(-1);
    getTitleFilter()
  }
  function openDrawerFilter() {
    storeFilters.showModal = true;
  }

  async function changeAgenda(scheduleType) {
    storeKanban.columns = [];
    storeKanban.scheduleType = scheduleType
    storeFilters.scheduleType = scheduleType
    await setUrlParams();
    await buildKanbanStructure();
    getTitleFilter()
  }

  async function week(){
    await changeAgenda(scheduleTypeModel[0].value) //week view
  }

  async function today(){
    storeFilters.selectedDate = moment().format(DATE_FORMAT);
    await changeAgenda(scheduleTypeModel[1].value) //day view
  }

  return {
    next,
    back,
    openDrawerFilter,
    titleFilter,
    isWeekAgenda,
    week,
    today
  };
}

