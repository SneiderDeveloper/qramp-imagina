import moment from 'moment';
import store from '../store/filters.store';
import { cache, router } from 'src/plugins/utils';
import modalScheduleStore from '../store/modalSchedule.store'
import scheduleTypeModel from '../models/scheduleType.model';

export default async function setUrlParams(): Promise<void> {
  try {
    const DATE_FORMAT = 'YYYY/MM/DD'
    const selectedDate = moment(store.selectedDate, DATE_FORMAT);
    const query = store.payload;
    query.typeAgenda = store.scheduleType;

    const isWeek = store.scheduleType == scheduleTypeModel[0].value
    if(isWeek){
      query.dateStart = selectedDate.startOf("week").format('YYYYMMDD');
      query.dateEnd = selectedDate.endOf("week").format('YYYYMMDD');
    } else {
      query.dateStart = selectedDate.format('YYYYMMDD');
    }

    modalScheduleStore.adhocRuleId = query.adhocRuleId;
    if (store.form.adhocRuleId) cache.set("adhocRuleId", store.form.adhocRuleId);
    router.push({
      name: router.route.name,
      query
    }).catch((error) => {
      if(error.name != ('NavigationDuplicated')) console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
}
