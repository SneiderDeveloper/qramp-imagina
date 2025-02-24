import moment from 'moment';
import kanbanStore from '../store/kanban.store';
import modalScheduleStore from '../store/modalSchedule.store'
import getIndividualWorkOrders from './getIndividualWorkOrders';


export default async function individualRefreshByColumns(): Promise<void> {
    const column: any = kanbanStore.columns.find(item => {
        return item.date.format('YYYY-MM-DD') === modalScheduleStore.seletedDateColumn
    });
    if (!column) return;
    try {
        column.loading = true;
        column.page = 1;

        const response = await getIndividualWorkOrders(
            true,
            column.page,
            moment(modalScheduleStore.seletedDateColumn)
        );
        column.cards = response.data;

        column.loading = false;
    } catch (error) {
        column.loading = false;
        console.log(error);
    }
}
