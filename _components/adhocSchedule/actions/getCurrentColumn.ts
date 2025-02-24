import { Columns } from "../contracts/kanbanStore.contract";
import storeFilters from "../store/filters.store";
import storeKanban from "../store/kanban.store";
import {model} from '../models/kanban.model';

export default function getCurrentColumn(): Columns {
    try {
        const col = storeKanban.columns.find((col) => col.date.format('YYYY/MM/DD') === storeFilters.selectedDate) || model
        return col;
    } catch (error) {
        console.log(error)
        return model;
    }
}
