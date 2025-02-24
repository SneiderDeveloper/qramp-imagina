import modelHoursFilter from '../models/hoursFilter.model'
import moment from 'moment';
import {HoursFilter} from '../contracts/hourFilter.contract'

export default function getCurrentTime(): string | null {
    try {
        const firstHour: string = modelHoursFilter[0].value;
        const currentHour: number = moment().hour();
        
        const filterTimeItem = (modelHoursFilter as HoursFilter[])
            .filter(item => item.value !== firstHour)
            .find(range => {
                const [start, end] = range.value.split('-').map(Number);
                return currentHour >= start && currentHour <= end;
            });

        const filterTime = filterTimeItem ? filterTimeItem.value : null;
        return filterTime;
    } catch (error) {
        console.log(error);
        return modelHoursFilter[0].value;
    }
}
