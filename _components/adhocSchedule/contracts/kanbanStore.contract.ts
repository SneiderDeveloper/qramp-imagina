import { Moment } from "moment";

export interface Columns {
  isDrag: boolean;
  date: Moment; // You can adjust the type to match your use case
  cards: any[]; // Replace 'any' with the actual card type
  page: number;
  loading: boolean;
  total: number;
}

interface Airline {
  airlineShortName: string | null;
}

interface Airport {
  airportIataCode: string | null;
}

export interface ScheduleRule {
  airline: Airline;
  airport: Airport;
}

export interface State {
  scheduleType: string;
  isDraggingCard: boolean;
  columns: Columns[];
  statusIdList: number[] | null;
  loading: boolean;
  dragDate: string;
  isBlank: boolean;
  filterCompany?: number;
  isAppOffline: boolean;
  search: string | null;
  title: string;
  showModalHistory: boolean;
  showModalCreateSchedule: boolean;
  scheduleRule: ScheduleRule | null;
}
