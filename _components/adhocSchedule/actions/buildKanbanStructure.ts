import storeKanban from "../store/kanban.store";
import moment, {Moment} from "moment";
import getAdhocSchedules from "../actions/getAdhocSchedules";
import {Columns} from "../contracts/kanbanStore.contract";
import storeFilters from "../store/filters.store";
import scheduleTypeModel from '../models/scheduleType.model';

export async function getColumns(): Promise<Columns[]> {
  try {
    const weekAgenda = scheduleTypeModel[0].value;
    const isWeek = storeKanban.scheduleType === weekAgenda;
    const ONE_DAY = 1
    const FULL_WEEK = 7
    const days = isWeek ? FULL_WEEK : ONE_DAY //full week | one day
    const type = isWeek ? 'week' : 'day'
    const DATE_FORMAT = 'YYYY/MM/DD'
    const startOfWeek: Moment = moment(storeFilters.selectedDate, DATE_FORMAT).startOf(type);

    return [...Array(days)].map((_, i) => ({
      date: moment(startOfWeek).add(i, "days"),
      cards: [],
      page: 1,
      loading: false,
      total: 0,
      isDrag: false,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getCards(refresh = false): Promise<void> {
  try {
    await Promise.all(storeKanban.columns.map(async (item: Columns) => {
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
      };

      try {
        const cardsData: any = await getAdhocSchedules(refresh, item.page, params)

        item.cards = cardsData.data;

        item.cards.forEach((card) => {
          card.editable = false;
          card.loading = false;
        });
        item.loading = false;
        item.total = cardsData.meta.page.total;
      } catch (error) {
        item.loading = false;
      }
    }));
  } catch (error) {
    storeKanban.columns.forEach(async (item: Columns) => {
      item.loading = false;
    });
    console.log(error);
  }
}

export default async function buildKanbanStructure(refresh = false): Promise<void> {
  try {
    storeKanban.loading = true;
    storeKanban.columns = await getColumns();
    if (!storeFilters.adhocRuleId) return;
    await getCards(refresh);
    storeKanban.loading = false;
  } catch (error) {
    console.log(error);
    storeKanban.loading = false;
  }
}
