import { reactive, computed } from 'vue';
import { BUSINESS_UNIT_SECURITY } from '../../model/constants';
import serviceListStore from '../../serviceList/store/serviceList'
import remarkStore from '../../remarks/store';
import qRampStore from 'src/modules/qramp/_store/qRampStore';
import workOrderList from 'src/modules/qramp/_store/actions/workOrderList'
import remarksStore from '../../remarks/store';
import stepps from '../models/defaultModels/stepps';
import signatureStore from 'src/modules/qramp/_components/signature/store/index.store'
import moment from 'moment';
import { configEntity } from '../models/defaultModels/entitiesConfig';

const MODEL_FORM = {
    id: null,
    customerId: null,
    contractId: null,
    statusId: null,
    operationTypeId: 2,
    type: null,
    businessUnitId : BUSINESS_UNIT_SECURITY,
    stationId: null,
    acTypeId: null,
    carrierId: null,
    responsibleId: null,
    inboundFlightNumber: null,
    inboundOriginAirportId: null,
    inboundTailNumber: null,
    inboundScheduledArrival: null,
    outboundFlightNumber: null,
    outboundDestinationAirportId: null,
    outboundTailNumber: null,
    outboundScheduledDeparture: null,
    inboundBlockIn: null,
    outboundBlockOut: null,
    faFlightId: null,
    parentId: null,
    scheduleDate: null,
    preFlightNumber: null,
}

const dateFormatterFull = (rawDate) => {
    if (!rawDate) return null
    return moment(rawDate).format('MM/DD/YYYY HH:mm')
}

const state = reactive({
    refsGlobal: {},
    step: 1,
    showModal: false,
    titleModal: '',
    lastTitle: ',',
    loading: false,
    updateModal: false,
    widthModal: '35vw',
    isUpdate: false,
    isClone: false,
    chip: null,
    dialogTable: false,
    dataTable: [],
    form: {
        ...MODEL_FORM
    },
    emitEvent: {},
})

const store = computed(() => ({
    get dataTable() {
      return state.dataTable;
    },
    set dataTable(value) {
      state.dataTable = value;
    },
    get dialogTable(): boolean {
      return state.dialogTable;
    },
    set dialogTable(value: boolean) {
      state.dialogTable = value;
    },
    get showModal(): boolean {
        return state.showModal;
    },
    set showModal(value: boolean) {
        state.showModal = value;
    },
    get isUpdate(): boolean {
        return state.isUpdate;
    },
    set isUpdate(value: boolean) {
        state.isUpdate = value;
    },
    get isClone(): boolean {
        return state.isClone;
    },
    set isClone(value: boolean) {
        state.isClone = value;
    },
    get chip(): { label: string } | null {
        return state.chip;
    },
    set chip(value: { label: string } | null) {
        state.chip = value;
    },
    get titleModal(): string {
        return state.titleModal;
    },
    set titleModal(value: string) {
        state.titleModal = value;
    },
    get lastTitle(): string {
        return state.lastTitle;
    },
    set lastTitle(value: string) {
        state.lastTitle = value;
    },
    get widthModal(): string {
        return state.widthModal;
    },
    set widthModal(value: string) {
        state.widthModal = value;
    },
    get loading(): boolean {
        return state.loading;
    },
    set loading(value: boolean) {
        state.loading = value;
    },
    get step(): number{
        return state.step;
    },
    set step(value: number) {
        state.step = value;
    },
    get refsGlobal() {
        return state.refsGlobal
    },
    set refsGlobal(value) {
        state.refsGlobal = {...value}
    },
    get form(): any{
        return configEntity.store.then(store => store.form);
    },
    set form(value: any) {
        configEntity.store.then(store => store.form = value)
        // const flightBoundFormStatus = qRampStore().getFlightBoundFormStatus();
        // if(value.id) {
        //     state.form.id = value.id;
        // }
        // state.form.id = value.id || null;
        // state.form.customerId = value.customerId || null;
        // state.form.contractId = value.contractId || null;
        // state.form.statusId = value.statusId || null;
        // state.form.operationTypeId = value.operationTypeId || 2;
        // state.form.type = value.type || null;
        // state.form.stationId = Number(value.stationId) || null;
        // state.form.acTypeId = value.acTypeId || null;
        // state.form.carrierId = value.carrierId || null;
        // state.form.responsibleId = value.responsibleId || null;
        // state.form.inboundFlightNumber = value.inboundFlightNumber || null;
        // state.form.inboundOriginAirportId = value.inboundOriginAirportId || null;
        // state.form.inboundTailNumber = value.inboundTailNumber || null;
        // state.form.inboundScheduledArrival = qRampStore().dateFormatterFull(value.inboundScheduledArrival) || null;
        // state.form.outboundFlightNumber = value.outboundFlightNumber || null;
        // state.form.outboundDestinationAirportId = value.outboundDestinationAirportId || null;
        // state.form.outboundTailNumber = value.outboundTailNumber || null;
        // state.form.outboundScheduledDeparture = qRampStore().dateFormatterFull(value.outboundScheduledDeparture) || null;
        // state.form.inboundBlockIn = qRampStore().dateFormatterFull(value.inboundBlockIn) || null;
        // state.form.outboundBlockOut = qRampStore().dateFormatterFull(value.outboundBlockOut) || null;
        // state.form.faFlightId = value.faFlightId || null;
        // state.form.parentId = value.parentId || null;
        // state.form.preFlightNumber = value.preFlightNumber || null;
        // flightBoundFormStatus.boundTailNumber = qRampStore().checkIfDataArrives(value.inboundTailNumber);
        // flightBoundFormStatus.outboundTailNumber = qRampStore().checkIfDataArrives(value.outboundTailNumber);
        // flightBoundFormStatus.boundScheduled = qRampStore().checkIfDataArrives(value.inboundScheduledArrival);
        // flightBoundFormStatus.boundScheduledDeparture = qRampStore().checkIfDataArrives(value.outboundScheduledDeparture);
        // flightBoundFormStatus.boundOriginAirportId = qRampStore().checkIfDataArrives(value.inboundOriginAirportId);
        // flightBoundFormStatus.boundDestinationAirport = qRampStore().checkIfDataArrives(value.outboundDestinationAirportId);

        // qRampStore().setTypeWorkOrder(value.type)
        // if(navigator.onLine) {
        //     qRampStore().setWorkOrderItems(value.workOrderItems);
        // } else {
        //     const storedWorkOrderServices = workOrderList().getWorkOrdersItemsList()?.filter(
        //         item => item.workorderId == value?.workOrderId
        //     );

        //     const workOrderItems = value.workOrderItems?.length > 0
        //         ? value.workOrderItems
        //         : storedWorkOrderServices;


        //     if (!workOrderItems) return
        //     const workOrderItemCamelCase = workOrderItems?.map(item => ({
        //         productId: item?.product_id,
        //         workOrderItemAttributes: item?.work_order_item_attributes?.map((attribute) => ({
        //             attributeId: attribute?.attribute_id,
        //             ...attribute
        //         })),
        //     }))
        //     qRampStore().setWorkOrderItems(workOrderItemCamelCase);
        // }
        // if (qRampStore().isNonFlight()) {
        //     state.form.scheduleDate = dateFormatterFull(value.scheduleDate)
        // }
        // serviceListStore().init().then();
        // remarksStore().setForm(value);
        // qRampStore().setStatusId(state.form.statusId);
    },
    changeStatus(statusId) {
        state.form.statusId = statusId;
    },
    async payload() {
        const serviceList = await serviceListStore().getServiceListSelected();
        const remarks = remarkStore().getForm();

        return {
            ...state.form,
            ...remarks,
            ...signatureStore.form,
            workOrderItems: [
                ...serviceList
            ],
        }
    },
    get emitEvent() {
      return state.emitEvent
    },
    set emitEvent(value) {
      state.emitEvent = {...value}
    },
    resetForm() {
        state.form = {
            ...MODEL_FORM
        }
    },
    reset() {
        state.step = 1;
        state.showModal = false;
        state.titleModal = '';
        state.isUpdate = false;
        state.loading = false;
        state.isClone = false;
        state.chip = null;
        state.form = {
            ...MODEL_FORM
        }
        stepps.forEach(item => {
         item.error = false;
        })
    }
})).value


export default store;
