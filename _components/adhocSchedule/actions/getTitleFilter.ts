import moment from 'moment';
import modelHoursFilter from '../models/hoursFilter.model'
import store from '../store/filters.store';
import storeKanban from '../store/kanban.store';
import scheduleTypeModel from "../models/scheduleType.model";

export default function getTitleFilter(): void {
    const filterTime = modelHoursFilter.find(item => store.form.time === item.value) || null;
    const DATE_FORMAT = 'YYYY/MM/DD'
    const selectedDate = moment(store.selectedDate, DATE_FORMAT);

    if(storeKanban.scheduleType == scheduleTypeModel[0].value){
      store.titleFilter = `${selectedDate
        .startOf("week")
        .format("MMMM D")} - ${selectedDate
        .endOf("week")
        .format("MMMM D")}, ${filterTime?.label}`
    } else {
      store.titleFilter = `${selectedDate.format("MMMM D")}, ${filterTime?.label}`
    }
}