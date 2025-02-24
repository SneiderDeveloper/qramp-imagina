export interface ScheduleForm {
    airportId: null | number | string;
    airlineId: null | number | string;
    startDate: null | number | string;
    dateRange: null | number | string;
}

export interface State {
    showModal: boolean;
    titleModal: string;
    filters: any;
    form: any;
    loading: boolean;
    updateModal: boolean;
    scheduleType: string;
    selectedDate: string;
    startDateTime: string;
    endDateTime: string;
    fullDay: string;
    showModalSchedule: boolean;
    titleFilter: string;
    scheduleForm: ScheduleForm,
    selectedTab: number;
    adhocRuleId: number | null;
}
