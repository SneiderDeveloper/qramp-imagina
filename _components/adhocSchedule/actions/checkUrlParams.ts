import moment from 'moment';
import store from '../store/filters.store';
import scheduleTypeModel from '../models/scheduleType.model';
import { router } from 'src/plugins/utils'

const DATE_FORMAT = 'YYYY/MM/DD'

export default async function checkUrlParams(): Promise<void>{
  const params = { ...router.route.query }

  try{
    if(store.adhocRuleId) {
      if(Object.keys(params).length !== 0){
        if (params.adhocRuleId) store.form.adhocRuleId = params.adhocRuleId;
        if (params.type) store.form.scheduleType = params.type;
        if (params.adHoc) store.form.adHoc = params.adHoc;
        if( params.type) store.scheduleType = params.typeAgenda;
        store.selectedDate = getSelectedDay(params)
      } else {
        /* defaults */
        store.form.scheduleType = scheduleTypeModel[0].value;
        store.scheduleType = scheduleTypeModel[0].value
        store.selectedDate = moment().format(DATE_FORMAT);
      }
    }
  } catch(err) {
    console.log(err);
  }
}

function getSelectedDay(params: any): string {
  const isWeek = store.scheduleType == scheduleTypeModel[0].value
  if(isWeek){
    const dateStart = moment(params.dateStart, DATE_FORMAT).format(DATE_FORMAT);
    const dayOfweek = moment(store.selectedDate, DATE_FORMAT).day();
    return moment(dateStart, DATE_FORMAT).day(dayOfweek).format(DATE_FORMAT);
    } else {
    return moment(params.dateStart, DATE_FORMAT).format(DATE_FORMAT);
  }
}
