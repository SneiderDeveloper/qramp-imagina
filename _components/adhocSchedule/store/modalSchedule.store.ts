import moment from 'moment';
import { reactive, computed } from 'vue';

interface State {
    showModal: boolean;
    titleModal: string;
    loading: boolean;
    form: any;
    seletedDateColumn: any;
    isEdit: boolean;
    adhocRuleId: number | null;
}

const state = reactive<State>({
    showModal: false,
    titleModal: '',
    loading: false,
    form: {},
    seletedDateColumn: null,
    isEdit: false,
    adhocRuleId: null,
})

function getForm(data: any) {
    const form: any = {};
    if (data.id) {
        form.id = data.id
    }
    form.sta = data.inboundScheduledArrival ? moment(data.inboundScheduledArrival).format('HH:mm') : null;
    form.outboundScheduledDeparture = data.outboundScheduledDeparture ? moment(data.outboundScheduledDeparture).format('MM/DD/YYYY HH:mm') : null;
    form.inboundFlightNumber = data.inboundFlightNumber;
    form.preFlightNumber = data.inboundFlightNumber;
    form.adhocRuleId = data.adhocRuleId;
    form.gateId = data.gateId;
    form.operationTypeId = data.operationTypeId;
    form.std = data.std;
    form.flightStatusId = data.flightStatusId;
    form.acTypeId = data.acTypeId;
    form.inboundScheduledArrival = data.inboundScheduledArrival;
    form.statusId = data.statusId;
    return form;
}

const store = computed(() => ({
    get showModal(): boolean {
        return state.showModal;
    },
    set showModal(value: boolean) {
        state.showModal = value;
    },
    get titleModal(): string {
        return state.titleModal;
    },
    set titleModal(value: string) {
        state.titleModal = value;
    },
    get loading(): boolean {
        return state.loading;
    },
    set loading(value: boolean) {
        state.loading = value;
    },
    get adhocRuleId(): number | null {
        return state.adhocRuleId;
    },
    set adhocRuleId(value: number | null) {
        state.adhocRuleId = value;
    },
    get form() {
        return state.form;
    },
    set form(data) {
        state.form = getForm(data);
    },
    get seletedDateColumn() {
        return state.seletedDateColumn;
    },
    set seletedDateColumn(value) {
        state.seletedDateColumn = value;
    },
    get isEdit() {
        return state.isEdit;
    },
    set isEdit(value) {
        state.isEdit = value;
    },
    reset(): void {
        state.form = {};
        state.showModal = false;
    },
})).value


export default store;
