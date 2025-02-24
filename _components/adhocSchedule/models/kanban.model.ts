import moment from "moment";
import { Columns } from "../contracts/kanbanStore.contract";

export const model: Columns = {
    date: moment(),
    cards: [],
    page: 1,
    loading: false,
    total: 0,
    isDrag: false,
}