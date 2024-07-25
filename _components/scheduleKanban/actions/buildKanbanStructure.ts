import storeKanban from "../store/kanban.store";
import moment, { Moment } from "moment";
import getWorkOrder from "../actions/getWorkOrder";
import getWorkOrdersStatistics from "./getWorkOrderStatistics";
import { Columns } from "../contracts/kanbanStore.contract";
import storeFilters from "../store/filters.store";
import scheduleTypeModel from '../models/scheduleType.model';
import modalScheduleStore from '../store/modalSchedule.store'
import _ from 'lodash'
import qRampStore from "src/modules/qramp/_store/qRampStore";
 
export async function getColumns(): Promise<Columns[]> {
  try {
    const  weekAgenda = scheduleTypeModel[0].value;
    //storeKanban.scheduleType = storeFilters.scheduleType;
    const isWeek = storeKanban.scheduleType === weekAgenda;
    const ONE_DAY = 1
    const FULL_WEEK = 7
    const days = isWeek ? FULL_WEEK : ONE_DAY //full week | one day
    const type = isWeek ? 'week' : 'day'
    const startOfWeek = moment(storeFilters.selectedDate, 'YYYY/MM/DD').startOf(type);

    return [...Array(days)].map((_, i) => ({
      date: moment(startOfWeek).add(i, "days"),
      cards: [],
      page: 1,
      loading: false,
      total: 0,
      isDrag: false,
      completed: 0,
      uncompleted: 0
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getCards(refresh = false): Promise<void> {
  try {
    storeKanban.columns.forEach(async (item: Columns) => {
      item.loading = true;
      const startDate = item.date.startOf('day');
      const endDate = item.date.endOf('day');
      const filterTime = storeFilters.filterTime;
      const params = {
        field: "schedule_date_local",
        type: "customRange",
        from: startDate.set({ 
          hour: filterTime[0], 
          minute: 0, second: 0 
        }).format('YYYY-MM-DD HH:mm:ss'),
        to: endDate.set({ 
          hour: filterTime[1], 
          minute: 59, 
          second: 59 
        }).format('YYYY-MM-DD HH:mm:ss')
      }

      const [cardsData, statistics] = await Promise.all([
        getWorkOrder(refresh, item.page, params),
        getWorkOrdersStatistics(refresh, params)
      ]);

      item.cards = cardsData.data;

      item.completed = statistics.data.completed
      item.uncompleted = statistics.data.uncompleted
      item.cards.forEach((card) => { card.editable = false, card.loading = false });
      item.loading = false;
      item.total = cardsData.meta.page.total;

    });
  } catch (error) {
    storeKanban.columns.forEach(async (item: Columns) => {
      item.loading = false;
    });
    console.log(error);
  }
}

export default async function buildKanbanStructure(refresh = false): Promise<void> {
  try {
    modalScheduleStore.showInline = false; // forces to close the scheduleForm
    storeKanban.loading = true;
    storeKanban.columns = await getColumns();
    if(!storeFilters.stationId) return;
    await getCards(refresh);
    storeKanban.loading = false;
  } catch (error) {
    console.log(error);
    storeKanban.loading = false;
  }
}
