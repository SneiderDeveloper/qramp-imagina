import { Moment } from "moment";

export interface Columns {
    date: Moment;
    cards: any[];
    page: number;
    loading: boolean;
    isDrag: boolean;
}