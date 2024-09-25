import {
    STATUS_DRAFT,
    STATUS_POSTED,
    STATUS_SUBMITTED,
    modelFlightBoundFormStatus,
    BUSINESS_UNIT_PASSENGER,
    OPERATION_TYPE_NON_FLIGHT,
    NON_FLIGHT,
    BUSINESS_UNIT_SECURITY,
    COMPANY_SECURITY
} from '../_components/model/constants.js'
import moment from 'moment';
import baseService from 'modules/qcrud/_services/baseService.js'
import { cacheOffline, i18n, store } from 'src/plugins/utils';
import { reactive } from "vue";
import storeKanban from '../_components/scheduleKanban/store/kanban.store.ts'
import momentTimezone from "moment-timezone";
import workOrderList from "./actions/workOrderList";


const state = reactive({
    titleOffline: '',
    statusId: STATUS_DRAFT,
    needToBePosted: false,
    flightNumberField: null,
    contractId: 0,
    workOrderItems: [],
    loading: false,
    flightBoundFormStatus: {...modelFlightBoundFormStatus},
    dateBoundBlock: {
        outboundBlockOut: null,
        inboundBlockIn: null,
        outboundScheduledDeparture: null,
        inboundScheduledArrival: null,
    },
    responsible: {},
    visibleMapModal: false,
    flightMap: null,
    loadingModalMap: false,
    flightList: [],
    flightId: 0,
    isblank: false,
    isPassenger: false,
    workOrder: {},
    isFueling: true,
    typeWorkOrder: null,
    isNonFlight: false,
    billingDate: null,
    clonedWorkOrder: null,
    businessUnitId: null,
    workOrderId: null,
});

export default function qRampStore() {
    function setWorkOrderId(value) {
      state.workOrderId = value;
    }
    function getWorkOrderId() {
      return state.workOrderId;
    }
    function setIsPassenger(value) {
        state.isPassenger = value;
    }
    function getIsFueling() {
        return state.isFueling;
    }
    function setIsFueling(value) {
        state.isFueling = value;
    }
    function getTypeWorkOrder() {
        return state.typeWorkOrder;
    }
    function setTypeWorkOrder(value) {
        state.typeWorkOrder = value;
    }

    function getWorkOrder() {
        return state.workOrder;
    }

    function setWorkOrder(value) {
        state.workOrder = value;
    }

    function getIsPassenger() {
        return state.isPassenger;
    }

    function getTitleOffline() {
        return state.titleOffline;
    }

    function setTitleOffline(value) {
        state.titleOffline = value;
    }

    function setStatusId(value) {
        state.statusId = value;
    }

    function getStatusId() {
        return state.statusId;
    }

    function setNeedToBePosted(value) {
        state.needToBePosted = value;
    }

    function getIsblank(value) {
        return state.isblank;
    }

    function setIsblank(value) {
        state.isblank = value;
    }

    function disabledReadonly() {
        const statusId = Number(state.statusId);
        if (state.isblank) {
            return true;
        }
        if (statusId === STATUS_DRAFT && state.needToBePosted) {
            return true;
        }
        if (statusId === STATUS_SUBMITTED && !editPermissionseSubmitted()) {
            return true;
        }
        if (statusId === STATUS_POSTED) {
            return true;
        }
        return false;
    }

    function setFlightNumberField(value) {
        state.flightNumberField = value;
    }

    function getFlightNumberField() {
        return state.flightNumberField;
    }

    function setContractId(value) {
        state.contractId = value;
    }

    function getContractId() {
        return state.contractId;
    }

    function setWorkOrderItems(data) {
        state.workOrderItems = data;
    }

    function getWorkOrderItems() {
        return state.workOrderItems;
    }

    function getLoading() {
        return state.loading;
    }

    function hideLoading() {
        state.loading = false;
    }

    function showLoading() {
        state.loading = true;
    }

    function validateStatusSelectedFlight(data) {
        state.flightBoundFormStatus.boundOriginAirportId = this.isData(data.destinationAirport.id);
        state.flightBoundFormStatus.boundTailNumber = this.isData(data.registration);
        state.flightBoundFormStatus.outboundTailNumber = this.isData(data.registration || data.outRegistration);
        state.flightBoundFormStatus.boundDestinationAirport = this.isData(data.originAirport.id);
        state.flightBoundFormStatus.boundScheduled = this.isData(data.estimatedOn);
        state.flightBoundFormStatus.boundScheduledDeparture = this.isData(data.estimatedOff);
        if (state.isPassenger) {
            state.flightBoundFormStatus.inboundGateArrival = this.isData(data.gateDestination);
            state.flightBoundFormStatus.outboundGateDeparture = this.isData(data.gateOrigin);
        }

    }

    function isData(data) {
        return (!data || data === '') ? false : true;
    }

    function resetFlightBoundFormStatus() {
        state.flightBoundFormStatus = {...modelFlightBoundFormStatus};
    }

    function showFielFlightBoundFormStatus() {
        const status = {
            boundOriginAirportId: false,
            boundTailNumber: false,
            boundScheduled: false,
            boundScheduledDeparture: false,
        }
        if (state.isPassenger) {
            status.inboundGateArrival = false;
            status.outboundGateDeparture = false;
        }
        state.flightBoundFormStatus = status;
    }

    function getFlightBoundFormStatus() {
        return state.flightBoundFormStatus;
    }

    function validateFutureDateTime(dateTime, dateMin = null, currentDate) {
        const DATE_FORMAT = 'MM/DD/YYYY HH:mm';
        const current = moment(currentDate, DATE_FORMAT).format('YYYY/MM/DD');
        const date = moment();
        const today = date.format('YYYY/MM/DD');
        const hour = date.format('H');
        const min = date.format('mm');
        if (isNaN(dateTime)) {
            return dateTime <= today
        }
        if (dateMin) {
            return today === current ? Number(dateMin) <= min : true;
        }
        return today === current ? dateTime <= hour : true;
    }

    function setDateInboundBlockIn(value) {
        state.dateBoundBlock.inboundBlockIn = value;
    }

    function getDateInboundBlockIn() {
        return state.dateBoundBlock.inboundBlockIn;
    }

    function setDateOutboundBlockOut(value) {
        state.dateBoundBlock.outboundBlockOut = value;
    }

    function getDateOutboundBlockOut() {
        return state.dateBoundBlock.outboundBlockOut;
    }

    function setDateOutboundScheduledDeparture(value) {
        state.dateBoundBlock.outboundScheduledDeparture = value;
    }

    function getDateOutboundScheduledDeparture() {
        return state.dateBoundBlock.outboundScheduledDeparture;
    }

    function setDateinboundScheduledArrival(value) {
        state.dateBoundBlock.inboundScheduledArrival = value;
    }

    function getDateinboundScheduledArrival() {
        return state.dateBoundBlock.inboundScheduledArrival;
    }

    function validateDateInboundBlockIn(dateTime, dateMin = null) {
        const date = getDateInboundBlockIn() ?
            moment(getDateInboundBlockIn()) : moment();
        const today = date.format('YYYY/MM/DD');
        const hour = date.format('H');
        const min = date.format('mm')
        if (isNaN(dateTime)) {
            if (getDateInboundBlockIn()) {
                return dateTime <= today;
            }
            return dateTime <= moment().format('YYYY/MM/DD');
        }
        if (dateMin) {
            return Number(dateMin) <= min;
        }
        return dateTime <= hour;
    }

    function validateDateOutboundBlockOut(dateTime, dateMin = null) {
        const date = getDateOutboundBlockOut() ?
            moment(getDateOutboundBlockOut()) : moment();
        const hour = date.format('H');
        const min = date.format('mm');
        if (isNaN(dateTime)) {
            if (getDateOutboundBlockOut()) {
                return dateTime <= date.format('YYYY/MM/DD') &&
                    dateTime >= moment(getDateInboundBlockIn()).format('YYYY/MM/DD');
            }
            return dateTime <= moment().format('YYYY/MM/DD') &&
                dateTime >= moment(getDateInboundBlockIn()).format('YYYY/MM/DD');
        }
        if (dateMin) {
            return Number(dateMin) <= min;
        }
        return dateTime <= hour;
    }

    function getDifferenceInHours(start, end) {
        if (start) {
            const DATE_FORMAT = 'MM/DD/YYYY HH:mm';
            const dateStart = moment(start, DATE_FORMAT);
            const dateEnd = moment(end, DATE_FORMAT);
            const hour = dateEnd.diff(dateStart, 'minutes') / 60;
            return Math.round(hour * 100) / 100;
        }
        return 0;
    }

    function dateFormatter(date) {
        if (!date) return null
        const [year, month, day] = date.substr(0, 10).split('-')
        return `${month}/${day}/${year}`
    }

    function getTableListOfFlights(data) {
        const dataTable = [];
        data.forEach((items, index) => {
            const timezoneDestination = momentTimezone.tz(items.destinationAirport.timezone).format("z");
            const timezoneOriginAirport = momentTimezone.tz(items.originAirport.timezone).format("z");
            const date = items.scheduledOn ? dateFormatter(items.scheduledOn.split("T")[0]) : '';
            const inboundTime = items.estimatedOn ? momentTimezone(items.estimatedOn).tz(items.destinationAirport.timezone).format('MM-DD-YYYY h:mm:ss a') : '';
            const outboundTime = items.estimatedOff ? momentTimezone(items.estimatedOff).tz(items.originAirport.timezone).format('MM-DD-YYYY h:mm:ss a') : '';
            const destinationAirportId = items.destinationAirport ? items.destinationAirport.id : '';
            const flight = {
                index,
                date,
                destinationAirportId,
                registration: items.registration,
                inbound: `${inboundTime} - ${timezoneDestination || ''}`,
                outbound: `${outboundTime} - ${timezoneOriginAirport || ''}`,
                aircraftType: items.aircraftType,
                faFlightId: items.faFlightId,
                cancelled: items.cancelled,
            }
            if (state.isPassenger) {
                flight.gateDestination = items.gateDestination || '';
                flight.gateOrigin = items.gateOrigin || '';
            }

            dataTable.push(flight)
        })
        return dataTable;
    }

    function setResponsible(data) {
        state.responsible = data;
    }

    function getResponsible() {
        return state.responsible;
    }

    function numberInRange(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function hideVisibleMapModal() {
        state.visibleMapModal = false;
    }

    function showVisibleMapModal() {
        state.visibleMapModal = true;
    }

    function getVisibleMapModal() {
        return state.visibleMapModal;
    }

    function setVisibleMapModal(value) {
        state.visibleMapModal = value;
    }

    function setFlightMap(data) {
        state.flightMap = data;
    }

    function getFlightMap() {
        return state.flightMap;
    }

    function getLoadingModalMap() {
        return state.loadingModalMap;
    }

    function setLoadingModalMap(value) {
        state.loadingModalMap = value;
    }

    function setFlightList(value) {
        state.flightList = value;
    }

    function getFlightList() {
        return state.flightList;
    }

    function getFlightId() {
        return state.flightId;
    }

    function setFlightId(value) {
        state.flightId = value;
    }

    function getBillingDate() {
        return state.billingDate;
    }

    function setBillingDate(value) {
        state.billingDate = value;
    }

    function getClonedWorkOrder() {
        return state.clonedWorkOrder
    }

    function setClonedWorkOrder(value) {
        state.clonedWorkOrder = value
    }

    function isNonFlight() {
        return getTypeWorkOrder() === NON_FLIGHT
    }

    function editPermissionseSubmitted() {
        return store.hasAccess('ramp.work-orders.edit-when-submitted');
    }

    function setAttr(obj) {
        try {
            const att = [];
            for (let key in obj) {
                if (obj[key].id && obj[key].attributeId) {
                    att.push({
                        name: obj[key].name,
                        value: obj[key].value,
                        attribute_id: obj[key].attributeId,
                        id: obj[key].id,
                    })
                } else if (obj[key].id && !obj[key].attributeId) {
                    att.push({
                        name: obj[key].name,
                        value: obj[key].value,
                        attribute_id: obj[key].id,
                    })
                } else if (obj[key].attributeId && obj[key].value) {
                    att.push({
                        name: obj[key].name,
                        value: obj[key].value,
                        attribute_id: obj[key].attributeId,
                    })
                }
            }
            return att
        } catch (error) {
            console.log(error);
        }
    }

    function productDataTransformation(data = []) {
        try {
            const products = [];
            data.forEach((items) => {
                if (items.id && items.productsId) {
                    products.push({
                        id: items.id,
                        product_id: items.productsId,
                        work_order_item_attributes: setAttr(items.formField)
                    })
                } else if (items.id && !items.productsId) {
                    products.push({
                        product_id: items.id,
                        work_order_item_attributes: setAttr(items.formField)
                    })
                } else if (items.id && isDelete(items.formField)) {
                    products.push({
                        product_id: items.productsId,
                        work_order_item_attributes: setAttr(items.formField)
                    })
                }
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }

    function isDelete(obj) {
        try {
            const att = []
            for (let key in obj) {
                return obj[key].value && obj[key].value != ""
            }
            return att
        } catch (error) {
            console.log(error);
        }
    }

    async function getFlights() {
        try {
            const companyId = getFilterCompany();
            const workOrderId = state.flightId;
            const params = {
                refresh: true,
                params: {
                    filter: {
                        companyId,
                    }
                }
            };
            if (workOrderId) params.params.filter.id = workOrderId;
            const response = await baseService.index("apiRoutes.qramp.flightPosition", params);
            const data = workOrderId ? [response.data] : response.data;
            setFlightList(data);
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    function getBusinessUnitId() {
        return state.businessUnitId
    }
    function setBusinessUnitId(value) {
        state.businessUnitId = value
    }

    function getOperationTypeIdNonFlight() {
        const businessUnitId = getBusinessUnitId()
        if (businessUnitId === BUSINESS_UNIT_PASSENGER) return OPERATION_TYPE_NON_FLIGHT[0]
        if (businessUnitId === BUSINESS_UNIT_SECURITY) return OPERATION_TYPE_NON_FLIGHT[1]
    }

    function getFilterCompany() {
        const isPassenger = getIsPassenger();
        let companies = isPassenger ? store.getSetting('ramp::passengerCompanies') : store.getSetting('ramp::rampCompanies');
        if(!isPassenger && getBusinessUnitId() === BUSINESS_UNIT_SECURITY) {
            companies = COMPANY_SECURITY
        }
        return companies;
    }
    async function changeStatus(statusId, workOrderId) {
        try {
            const API_ROUTE = 'apiRoutes.qramp.workOrderChangeStatus';
            const CACHE_PATH = 'apiRoutes.qramp.workOrders'
            const payload = {
                id: workOrderId,
                statusId
            }

            if (storeKanban.isAppOffline) {
                payload.titleOffline = i18n.tr("ifly.cms.form.updateWorkOrder");
            }

            await cacheOffline.updateRecord(CACHE_PATH, payload, payload?.id),
            await baseService.update(API_ROUTE, workOrderId, payload);
        } catch (error) {
            console.log('Error changeStatus Schedule', error);
        }
    }

    function parseDateOfflineWO(dateWO) {
        if (!dateWO && !dateWO?.includes('T')
    )
        return dateWO;
        const splitDate = dateWO.split(" ");
        const [date, hour] = splitDate;
        const newDate = new Date(date).toLocaleDateString('fr-CA');
        return `${newDate}T${hour}`;
    }

    function dateFormatterFull(rawDate) {
      if (!rawDate) return null
      return moment(rawDate).format('MM/DD/YYYY HH:mm')
    }

    function isbound(operationTypeId) {
      if (operationTypeId) {
        const operationType = workOrderList().getOperationTypeList()
          .find(item => item.id === Number(operationTypeId));
        const type = operationType?.options?.type;
        if (type) {
          if (type === 'full') {
            return [true, true];
          }
          if (type === 'inbound') {
            return [true, false]
          }
          if (type === 'outbound') {
            return [false, true];
          }
        }
      }
      return [false, false];
    }

    function getFormTable(data) {
      const {
        ident,
        destinationAirport,
        estimatedOff,
        registration,
        originAirport,
        estimatedOn
      } = data;

      const destinationAirportId = destinationAirport?.id || null;
      const originAirportId = originAirport?.id || null;

      const result = {};
      result.inboundFlightNumber = ident;
      result.inboundOriginAirportId = originAirportId;
      result.inboundScheduledArrival = this.dateFormatterFull(estimatedOn);
      result.inboundTailNumber = registration;
      result.outboundFlightNumber = ident;
      result.outboundDestinationAirportId = destinationAirportId;
      result.outboundScheduledDeparture = this.dateFormatterFull(estimatedOff);
      result.outboundTailNumber = registration;
      return result;
    }
    function checkIfDataArrives(data) {
      return (data === null || data === '') ? false : true;
    }
    return {
        getTitleOffline,
        setTitleOffline,
        disabledReadonly,
        setStatusId,
        getStatusId,
        setNeedToBePosted,
        setFlightNumberField,
        getFlightNumberField,
        setContractId,
        getContractId,
        setWorkOrderItems,
        getWorkOrderItems,
        getLoading,
        hideLoading,
        showLoading,
        validateStatusSelectedFlight,
        getFlightBoundFormStatus,
        resetFlightBoundFormStatus,
        showFielFlightBoundFormStatus,
        isData,
        validateFutureDateTime,
        setDateInboundBlockIn,
        getDateInboundBlockIn,
        setDateOutboundBlockOut,
        getDateOutboundBlockOut,
        setDateOutboundScheduledDeparture,
        setDateinboundScheduledArrival,
        getDateOutboundScheduledDeparture,
        getDateinboundScheduledArrival,
        validateDateOutboundBlockOut,
        validateDateInboundBlockIn,
        getDifferenceInHours,
        dateFormatter,
        getTableListOfFlights,
        setResponsible,
        getResponsible,
        numberInRange,
        hideVisibleMapModal,
        showVisibleMapModal,
        getVisibleMapModal,
        setVisibleMapModal,
        setFlightMap,
        getFlightMap,
        getLoadingModalMap,
        setLoadingModalMap,
        setFlightList,
        getFlightList,
        getFlightId,
        setFlightId,
        editPermissionseSubmitted,
        setAttr,
        productDataTransformation,
        isDelete,
        getFlights,
        setIsblank,
        getIsblank,
        setIsPassenger,
        getIsPassenger,
        changeStatus,
        parseDateOfflineWO,
        getWorkOrder,
        setWorkOrder,
        getIsFueling,
        setIsFueling,
        getTypeWorkOrder,
        setTypeWorkOrder,
        getBusinessUnitId,
        setBusinessUnitId,
        getOperationTypeIdNonFlight,
        getBillingDate,
        setBillingDate,
        getClonedWorkOrder,
        setClonedWorkOrder,
        isNonFlight,
        getFilterCompany,
        dateFormatterFull,
        getFormTable,
        checkIfDataArrives,
        getWorkOrderId,
        setWorkOrderId
    }
}
