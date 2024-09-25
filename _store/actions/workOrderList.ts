import baseService from 'modules/qcrud/_services/baseService.js'
import {reactive} from 'vue';
import qRampStore from '../qRampStore.js'
import {
    BUSINESS_UNIT_FUELING, BUSINESS_UNIT_LABOR,
    BUSINESS_UNIT_PASSENGER,
    BUSINESS_UNIT_RAMP,
    BUSINESS_UNIT_SECURITY,
    COMPANY_PASSENGER,
    COMPANY_RAMP,
    COMPANY_SECURITY,
    FLIGHT,
    FUELING,
    LABOR,
    NON_FLIGHT,
    SECURITY
} from '../../_components/model/constants.js';
import {
  Contract,
  CustomerContract,
  FlightStatusContract,
  Gates,
  OperationType,
  State,
  StationContract,
  WorkOrderList,
  WorkOrders,
  WorkOrderStatusesContract,
  WorkOrderDelays,
} from './@Contracts/workOrderList.contract';
import factoryCustomerWithContracts from './factoryCustomerWithContracts.js'
import {store} from 'src/plugins/utils'
import serviceListStore from '../../_components/serviceList/store/serviceList'
import storeFlight from 'src/modules/qramp/_components/flight/store';
import { getCategories } from 'src/modules/qramp/_store/actions/services'
import filtersStore from "../../_components/scheduleKanban/store/filters.store";

const state = reactive<State>({
  operationTypeList: [],
  stationList: [],
  customerList: [],
  contractList: [],
  flightStatusesList: [],
  workOrderStatusesList: [],
  gatesList: [],
  customerWithContractList: [],
  airlinesList: [],
  actypesList: [],
  airportsList: [],
  workOrderDelays: [],
  responsibleList: [],
  workOrderItems: [],
  paxOperationTypeList: [],
  /* Creating a new array called workOrderList and assigning it to the variable workOrderList. */
  workOrderList: {
    data: [],
    meta: {
      page: {
        total: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 1,
        perPage: 1,
      },
    }
  },
});
const cacheTimeForm24Hour: number = 60 * 60 * 24;
const cacheTimeForThirtyDays: number = cacheTimeForm24Hour * 30;
const accessMap = {
  'passenger': 'ramp.passenger-work-orders.index',
  'fueling': 'ramp.fueling-work-orders.index',
  'labor': 'ramp.labor-work-orders.index',
  'security': 'ramp.security-work-orders.index',
  'ramp': 'ramp.work-orders.manage'
};

function demoMessage(error: any): void {
  if(error.code !== 'ERR_CANCELED') {
    console.error(error);
  }
}
/**
 * This is a work order list function that returns an object with several functions to
 * interact with OperationType, StationContract, CustomerContract, Contract,
 * FlightStatusContract, and WorkOrderStatusesContract.
 * @returns {WorkOrderList} A WorkOrderList object.
 */
export default function workOrderList(): WorkOrderList {
  const {hasAccess} = store

  /**
   * This function returns the workOrderList property of the state object.
   * @returns the state.workOrderList.
   */
  function getPaxOperationTypeList(): any[] {
    return state.paxOperationTypeList;
  }

  function setPaxOperationTypeList(data: any) {
    return state.paxOperationTypeList = data;
  }

  function getCustomerWithContractLists() {
    return state.customerWithContractList;
  }

  function setCustomerWithContractLists(data: any) {
    return state.customerWithContractList = data;
  }

  function getWorkOrdersItemsList() {
    return state.workOrderItems;
  }

  function setWorkOrdersItemsList(data: any) {
    return state.workOrderItems = data;
  }

  function getDataWorkOrderList(): WorkOrders {
    return state.workOrderList;
  }

  /**
   * This function takes a parameter of type WorkOrders and sets the state.workOrderList to the value
   * of the parameter.
   * @param {WorkOrders} data - WorkOrders
   */
  function setDataWorkOrderList(data: WorkOrders): void {
    state.workOrderList = data;
  }

  /**
   * This function takes an array of OperationType objects and assigns it to the operationTypeList
   * property of the state object.
   * @param {OperationType[]} data - OperationType[] - this is the data that is being passed in from
   * the component.
   */

  function setOperationTypeList(data: OperationType[]): void {
    state.operationTypeList = data;
  }

  /**
   * It returns a list of OperationType objects.
   * @returns The operationTypeList array.
   */
  function getOperationTypeList(): OperationType[] {
    return state.operationTypeList;
  }

  /**
   * This function takes an array of StationContract objects and assigns it to the stationList
   * property of the state object.
   * @param {StationContract[]} data - StationContract[]
   */
  function setStationList(data: StationContract[]): void {
    state.stationList = data;
  }

  /**
   * This function returns an array of StationContract objects.
   * @returns The stationList array.
   */
  function getStationList(): StationContract[] {
    return state.stationList;
  }

  //
  function setAirlinesList(data): void {
    state.airlinesList = data;
  }

  function getAirlinesList(): any {
    return state.airlinesList;
  }

  function setACTypesList(data): void {
    state.actypesList = data;
  }

  function getACTypesList(): any {
    return state.actypesList;
  }

  function setAirportsList(data): void {
    state.airportsList = data;
  }

  function getAirportsList(): any {
    return state.airportsList;
  }

  function getWorkOrderDelays(): WorkOrderDelays[] {
    return state.workOrderDelays;
  }

  function setWorkOrderDelays(data: WorkOrderDelays[]) {
    state.workOrderDelays = data;
  }

  function setResponsible(data): void {
    state.responsibleList = data
  }

  function getResponsible(): any {
    return state.responsibleList;
  }

  //

  /**
   * This function takes an array of CustomerContract objects and assigns it to the customerList
   * property of the state object.
   * @param {CustomerContract[]} data - CustomerContract[] - This is the data that is being passed
   * in.
   */
  function setCustomerList(data: CustomerContract[]): void {
    state.customerList = data;
  }

  /**
   * This function returns an array of CustomerContract objects.
   * @returns An array of CustomerContract objects.
   */
  function getCustomerList(): CustomerContract[] {
    return state.customerList;
  }

  /**
   * This function takes an array of Contract objects and assigns it to the contractList property of
   * the state object.
   * @param {Contract[]} data - Contract[]
   */
  function setContractList(data: Contract[]): void {
    state.contractList = data;
  }

  /**
   * The function getContractList returns an array of Contract objects.
   * @returns The contractList array.
   */
  function getContractList(): Contract[] {
    return state.contractList;
  }

  /**
   * This function takes an array of FlightStatusContract objects and assigns it to the
   * flightStatusesList property of the state object.
   * @param {FlightStatusContract[]} data - FlightStatusContract[]
   */
  function setFlightStatusesList(data: FlightStatusContract[]): void {
    state.flightStatusesList = data;
  }

  /**
   * It returns a list of FlightStatusContract objects.
   * @returns the value of the state.flightStatusesList property.
   */
  function getFlightStatusesList(): FlightStatusContract[] {
    return state.flightStatusesList;
  }

  /**
   * This function takes an array of WorkOrderStatusesContract objects and sets the
   * state.workOrderStatusesList property to that array.
   * @param {WorkOrderStatusesContract[]} data - WorkOrderStatusesContract[]
   */
  function setWorkOrderStatusesList(data: WorkOrderStatusesContract[]): void {
    state.workOrderStatusesList = data;
  }

  /**
   * This function returns a list of work order statuses.
   * @returns An array of WorkOrderStatusesContract objects.
   */
  function getWorkOrderStatusesList(): WorkOrderStatusesContract[] {
    return state.workOrderStatusesList;
  }

  /**
   * This function takes an array of Gates objects and sets the gatesList property of the state
   * object to that array.
   * @param {Gates[]} data - Gates[] - this is the data that is being passed in from the API call.
   */
  function setGatesList(data: Gates[]): void {
    state.gatesList = data;
  }

  /**
   * The function getGatesList() returns an array of Gates objects.
   * @returns The gatesList array.
   */
  function getGatesList(): Gates[] {
    return state.gatesList;
  }

  // actions
  /**
   * The function getOperationType() returns a Promise that resolves to an array of OperationType
   * objects or void.
   * @returns a Promise.
   */
  async function getOperationType(refresh = false): Promise<OperationType[] | void> {
    if (hasAccess('ramp.operation-types.index')) {
      try {
        const companyId = qRampStore().getFilterCompany();
        const params = {
          refresh,
          cacheTime: cacheTimeForThirtyDays,
          params: {
            filter: {
              companyId,
            }
          },
        }
        const response = await baseService.index('apiRoutes.qramp.operationTypes', params);
        const data = response.data.map(item => ({label: item.operationName, ...item, value: item.id}))
        setOperationTypeList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  /**
   * This function is an async function that returns a promise of an array of StationContract objects
   * or void.
   * @returns a Promise.
   */
  async function getStation(refresh = false): Promise<StationContract[] | void> {
    if (hasAccess('setup.stations.index')) {
      try {
        const isPassenger = qRampStore().getIsPassenger();
        const companyId = qRampStore().getFilterCompany();
        const filterRamp = isPassenger ? {companyId} : {
          companyId,
          "allTranslations": true
        };
        const params = {
          refresh,
          cacheTime: cacheTimeForThirtyDays,
          params: {
            filter: {...filterRamp}
          },
        }
        const response = await baseService.index('apiRoutes.qsetupagione.setupStations', params);
        const data = response.data;
        setStationList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  //"status":1,"companyId":26,"allTranslations":true
  async function getAirlines(refresh = false) {
    if (hasAccess('iflight.airline.index')) {
      try {
        const companyId = qRampStore().getFilterCompany();
        const params = {
          refresh,
          params: {
            filter: {status: 1, companyId, "allTranslations": true}
          },
        }
        const response = await baseService.index('apiRoutes.qfly.airlines', params);
        const data = response.data;
        setAirlinesList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  /**
   * Requests a list of customers from the server based on user type.
   * @returns A promise that will resolve with the array of CustomerContract objects or void if there's an error
   */
  async function getCustomer(refresh = false): Promise<CustomerContract[] | void> {
    if (hasAccess('setup.customers.index')) {
      try {
        const companyId = qRampStore().getFilterCompany();
        const params = {
          refresh,
          cacheTime: cacheTimeForThirtyDays,
          params: {
            filter: {
              companyId,
            }
          },
        }
        const response = await baseService.index('apiRoutes.qramp.setupCustomers', params);
        const data = response.data;
        setCustomerList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  /**
   * The function getContract() is an async function that returns a promise of an array of any type
   * or void.
   * @returns The data is being returned as an array of objects.
   */
  async function getContract(refresh = false): Promise<any[] | void> {
    if (hasAccess('ramp.operation-types.index')) {
      try {
        const companyId = qRampStore().getFilterCompany();
        const params = {
          refresh,
          cacheTime: cacheTimeForThirtyDays,
          params: {
            filter: {
              "contractStatusId": 1,
              companyId,
            }
          },
        }
        const response = await baseService.index('apiRoutes.qramp.setupContracts', params);
        const data = response.data;
        setContractList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  /**
   * This function gets the flight statuses from the server and sets the flight statuses list in the
   * store.
   * @returns a promise.
   */
  async function getFlightStatuses(refresh = false): Promise<FlightStatusContract[] | void> {
    if (hasAccess('iflight.flight-statuses.index')) {
      try {
        const companyId = qRampStore().getFilterCompany();
        const params = {
          refresh,
          params: {
            filter: {
              companyId,
            }
          },
        }
        const response = await baseService.index('apiRoutes.qfly.flightStatuses', params);
        const data = response.data;
        setFlightStatusesList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  /**
   * This function gets the work order statuses from the API and sets the work order statuses list in
   * the store.
   * @returns The data is being returned.
   */
  async function getWorkOrderStatuses(refresh = false): Promise<WorkOrderStatusesContract[] | void> {
    if (hasAccess('ramp.work-order-statuses.index')) {
      try {
        const isPassenger = qRampStore().getIsPassenger();
        const companyId = qRampStore().getFilterCompany();
        const filterRamp = isPassenger ? {companyId} : {
          companyId,
          "allTranslations": true
        }
        const params = {
          refresh,
          cacheTime: cacheTimeForThirtyDays,
          params: {
            filter: {...filterRamp}
          },
        }
        const response = await baseService.index('apiRoutes.qramp.workOrderStatuses', params);
        const data = response.data;
        setWorkOrderStatusesList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  /**
   * "getGates() is an async function that returns a Promise of Gates[] or void"</code>
   * @returns The data is being returned as an array of objects.
   */
  async function getGates(refresh = false): Promise<Gates[] | void> {
    if (hasAccess('setup.gates.index')) {
      try {
        const companyId = qRampStore().getFilterCompany();
        const params = {
          refresh,
          cacheTime: cacheTimeForThirtyDays,
          params: {
            filter: {
              companyId,
            }
          },
        }
        const response = await baseService.index('apiRoutes.qsetupagione.gates', params);
        const data = response.data;
        setGatesList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  /**
   * This function is an async function that returns a promise of type WorkOrders or void. It calls a
   * function called baseService.index() which returns a promise of type WorkOrders. The function
   * then sets the dataWorkOrderList to the response and returns the data.
   * @returns The data is being returned as an array of objects.
   */
  async function getWorkOrders(refresh = false, businessUnit?, type?): Promise<WorkOrders | void> {
    if (hasAccess('ramp.work-orders.index') || hasAccess('ramp.passenger-work-orders.index')) {
      try {
        const isPassenger = qRampStore().getIsPassenger();
        let businessUnitId = isPassenger ? BUSINESS_UNIT_PASSENGER : BUSINESS_UNIT_RAMP;
        if (businessUnit) businessUnitId = businessUnit;

        const params = {
          refresh: refresh,
          cacheTime: cacheTimeForThirtyDays,
          params: {
            //include: 'responsible,workOrderItems,workOrderItems.workOrderItemAttributes',
            filter: {
              businessUnitId,
              date: {
                field: "created_at",
                type: "5daysAroundToday",
                from: null,
                to: null
              },
              order: {
                field: "id",
                way: "desc"
              },
              ...(type ? { type } : {}),
              withoutDefaultInclude: true,
            },
            page: 1
          },
        }
        const response = await baseService.index('apiRoutes.qramp.workOrders', params, true);
        const data = response;
        const responseWorkItems = await getWorkOrderItems(params);
        setWorkOrdersItemsList(responseWorkItems?.data);
        setDataWorkOrderList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  const getWorkOrderItems = async (paramsData) => {
    try {
      const params = {
        refresh: true,
        params: {
          include: 'workOrderItemAttributes',
          filter: {
            ...paramsData.params.filter
          },
        }
      };

      return await baseService.index('apiRoutes.qramp.workOrderItems', params);
    } catch (error) {
      demoMessage(error)
    }
  }


  async function getWorkOrderConditionally(refresh = false) {
    const businessUnits = {
      'passenger': BUSINESS_UNIT_PASSENGER,
      'fueling': BUSINESS_UNIT_FUELING,
      'labor': BUSINESS_UNIT_LABOR,
      'security': BUSINESS_UNIT_SECURITY,
    };

    const typesUnits = {
      'passenger': [FLIGHT, NON_FLIGHT],
      'fueling': FUELING,
      'labor': LABOR,
      'security': SECURITY
    }

    const accessibleUnits = Object.entries(accessMap)
      .filter(([_, permission]) => hasAccess(permission))

    const businessIds = accessibleUnits.map(([unit, _]) => businessUnits[unit]);
    const typeIds = accessibleUnits
      .flatMap(([unit, _]) => typesUnits[unit])
      .filter(type => type !== undefined)

    if (accessibleUnits.length > 0) {
      await getWorkOrders(refresh, businessIds, typeIds);
    }
  }

  const getListOfServicesConditionally = async () => {
    if (hasAccess(accessMap.ramp)) {
      await getCategories(COMPANY_RAMP);
    }

    if (hasAccess(accessMap.passenger)) {
      await getCategories(COMPANY_PASSENGER);
    }

    if (hasAccess(accessMap.security)) {
      await getCategories(COMPANY_SECURITY);
    }
  }

  async function getACTypes(refresh = false) {
    if (hasAccess('iflight.aircrafttype.index')) {
      try {
        const companyId = qRampStore().getFilterCompany();
        const params = {
          refresh,
          params: {
            filter: {
              "status": 1,
              companyId,
              "allTranslations": true
            },
          },
        }
        const response = await baseService.index('apiRoutes.qfly.aircraftTypes', params);
        const data = response.data;
        setACTypesList(data);
        return data;
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  async function getListDelays(refresh = false) {
    if (hasAccess('ramp.work-order-delays.index')) {
      try {
        const API_ROUTE = 'apiRoutes.qramp.workOrderDelays'
        const companyId = qRampStore().getFilterCompany();
        const params = {
          refresh,
          params: {
            filter: {
              companyId,
            },
          },
        };
        const response = await baseService.index(API_ROUTE, params)
        const data = response.data || [];
        const codeList = data.map((item) => ({
          id: item.id,
          label: item.name,
          value: item.name,
        }));
        setWorkOrderDelays(codeList);
      } catch (error) {
        demoMessage(error);
      }
    }
  }

  async function getResponsibleList(refresh = false) {
    if (hasAccess('ramp.work-orders.index') || hasAccess('ramp.passenger-work-orders.index')) {
      try {
        const API_ROUTE = 'apiRoutes.quser.users'
        const companyId = qRampStore().getFilterCompany();
        const params = {
          refresh,
          params: {
            filter: {
              companyId,
            },
          },
        };
        const response = await baseService.index(API_ROUTE, params)
        const data = response.data || [];
        setResponsible(data);
      } catch (error) {
        demoMessage(error);
      }
    }
  }

    function getCustomerWithContract(refresh = false, fullContract = false): Promise<any[] | void> {
      return new Promise(async (resolve) => {
        if (hasAccess('setup.contracts.index') && hasAccess('setup.customers.index')) {

        const allowContractName = hasAccess('ramp.work-orders.see-contract-name') || false;
        const companyId = qRampStore().getFilterCompany();
        let businessUnitId: any = { businessUnitId : qRampStore().getBusinessUnitId() || BUSINESS_UNIT_RAMP };
        if(fullContract) {
            businessUnitId = {}
        }
        const custemerParams = {
            refresh,
            params: {
                filter: {
                    withoutContracts: true,
                    customerStatusId: 1,
                    companyId,
                }
            },
        }
        const contractParams = {
            params: {
                filter: {
                    contractStatusId: 1,
                    ...businessUnitId,
                }
            },
        }
        const customersData = await Promise.all([
            baseService.index('apiRoutes.qramp.setupCustomers', custemerParams),
            baseService.index('apiRoutes.qramp.setupContracts', contractParams)
        ]);
        const customerList = factoryCustomerWithContracts(customersData, allowContractName);
        setCustomerWithContractLists(customerList);
        return resolve(customerList);
        }else{
            resolve();
        }
      })
    }

    async function getAirports(refresh = false) {
        if (hasAccess('iflight.airport.index')) {
            try {
                const companyId = qRampStore().getFilterCompany();
                const params = {
                  refresh,
                  params: {
                    filter: {
                      "status": 1,
                      companyId,
                      "allTranslations": true
                    },
                  },
                }
                const response = await baseService.index('apiRoutes.qfly.airports', params);
                const data = response.data;
                setAirportsList(data);
                return data;
            } catch (error) {
                demoMessage(error);
            }
        }
    }


    async function getFavourites(refresh = false) {
        if (hasAccess('isite.favourites.index')) {
          if (!navigator.onLine) return;
            try {
              const {
                stationId,
                contractId,
                customerId,
                carrierId,
                operationTypeId
              } = storeFlight().getForm();
              const requestParameters = {
                refresh,
                params: {
                  filter: {
                    stationId,
                    contractId,
                    customerId,
                    carrierId,
                    operationTypeId
                  },
                }
              }
              const response = await baseService.index('apiRoutes.qramp.favourites', requestParameters);
              const data = response.data.map(item => ({
                  id: item.id,
                  contractId: item.contractId,
                  customerId: item.customerId,
                  stationId: item.stationId,
                  productId: item.productId,
                  carrierId: item.carrierId,
                  operationTypeId: item.operationTypeId,
              }));
              serviceListStore().setFavouriteList(data);
              return data;
            } catch (error) {
                demoMessage(error);
            }
        }
    }

    async function getWorkOrderSearch(search: string | null, refresh = false) {
        const API_ROUTE = 'apiRoutes.qramp.workOrders'
        const TYPE = [ FLIGHT, NON_FLIGHT ]
        const businessUnitId = qRampStore().getBusinessUnitId() || BUSINESS_UNIT_RAMP;
        const flightNumber = search ? { search: search?.toUpperCase() } : {};
        const requestParameters = {
            refresh,
            params: {
                include: "responsible,contract,customer",
                filter: {
                    withoutDefaultInclude: true,
                    businessUnitId,
                    ...flightNumber,
                    type: TYPE,
                    order: {
                        field: "id",
                        way: "desc"
                    }
                },
                page: 1,
                take: 100
            }
        }

        try {
            return await baseService.index(API_ROUTE, requestParameters)
        } catch (error) {
            demoMessage(error)
            return error
        }
    }

    async function getFlightawareSearch(search: null | string = null, refresh = false) {
      const API_ROUTE = 'apiRoutes.qfly.flightaware'
      const flightNumber = search ? {search: search?.toUpperCase()} : {};

      const requestParameters = {
            refresh,
             params: {
             filter: {
              ...flightNumber
             }}
        }
        const flightData = await baseService.index(API_ROUTE, requestParameters)
        return flightData;
    }

    async function getSearchFlightNumber(search: string, type: 'workorder' | 'flightaware', refresh) {
        if(type === 'workorder') return getFlightawareSearch(search, refresh)
        if(type === 'flightaware') return getWorkOrderSearch(search, refresh)

        return {
            data: []
        }
    }

    async function getBillingClosedDate(refresh=true) {
      const API_ROUTE = 'apiRoutes.qramp.billingClosedDate'

      try {
        const billingDateData = await baseService.index(
          API_ROUTE,
          {
            refresh,
            params: {
              filter: { field: 'name' }
            }
          }
        )

        return billingDateData
      } catch(error) {
        demoMessage(error)
        return error
      }
    }

  async function getPaxOperationType(refresh = false) {
    if (!hasAccess('ramp.pax-operation-types.index')) return [];
    const API_ROUTE = 'apiRoutes.qramp.paxOperationTypes'
    try {
      const response = await baseService.index(
        API_ROUTE,
        {
          refresh,
        }
      )
      setPaxOperationTypeList(response.data)
      return response
    } catch(error) {
      console.error(error)
      return error
    }
  }

  /**
   * The function getAllList() returns a Promise that resolves to void.
   */
  async function getAllList(refresh = false): Promise<void> {
    Promise.all([
      getListOfServicesConditionally(),
      getWorkOrderConditionally(refresh),
      getStation(refresh),
      getOperationType(refresh),
      getCustomerWithContract(refresh),
      getCustomer(refresh),
      getFlightStatuses(refresh),
      getWorkOrderStatuses(refresh),
      getGates(refresh),
      getAirlines(refresh),
      getACTypes(refresh),
      getListDelays(refresh),
      getResponsibleList(refresh),
      getAirports(refresh),
      getPaxOperationType(refresh)
    ]);
  }

  /**
   * This object consists of functions for getting and setting data for OperationType,
   * StationContract, CustomerContract, Contract, FlightStatusContract, and WorkOrderStatusesContract.
   * @typedef {Object} WorkOrderList
   * @property {function(data: OperationType[]): void} setOperationTypeList - Assigns an array of
   *    OperationType objects to the operationTypeList property of the state object.
   * @property {function(): OperationType[]} getOperationTypeList - Returns an array of
   *    OperationType objects.
   * @property {async function(): Promise<OperationType[] | void>} getOperationType - Gets an
   *    array of OperationType objects.
   * @property {function(data: StationContract[]): void} setStationList - Assigns an array of
   *    StationContract objects to the stationList property of the state object.
   * @property {function(): StationContract[]} getStationList - Returns an array of StationContract
   *    objects.
   * @property {async function(): Promise<StationContract[] | void>} getStation - Gets an array of
   *    StationContract objects.
   * @property {function(data: CustomerContract[]): void} setCustomerList - Assigns an array of
   *    CustomerContract objects to the customerList property of the state object.
   * @property {function(): CustomerContract[]} getCustomerList - Returns an array of
   *    CustomerContract objects.
   * @property {async function(): Promise<CustomerContract[] | void>} getCustomer - Gets an array of
   *    CustomerContract objects.
   * @property {function(data: Contract[]): void} setContractList - Assigns an array of Contract
   *    objects to the contractList property of the state object.
   * @property {function(): Contract[]} getContractList - Returns an array of Contract objects.
   * @property {async function(): Promise<any[] | void>} getContract - Gets an array of objects of any type.
   * @property {function(): FlightStatusContract[]} getFlightStatusesList - Returns a list of
   *    FlightStatusContract objects.
   * @property {function(data: FlightStatusContract[]): void} setFlightStatusesList - Assigns an
   *    array of FlightStatusContract objects to the flightStatusesList property of the state object.
   * @property {async function(): Promise<FlightStatusContract[] | void>} getFlightStatuses - Gets
   *    an array of FlightStatusContract objects.
   * @property {function(): WorkOrderStatusesContract[]} getWorkOrderStatusesList - Returns
   *    a list of work order statuses.
   * @property {function(data: WorkOrderStatusesContract[]): void} setWorkOrderStatusesList -
   *    Assigns an array of WorkOrderStatusesContract objects to the workOrderStatusesList property
   *    of the state object.
   * @property {async function(): Promise<WorkOrderStatusesContract[] | void>} getWorkOrderStatuses -
   *    Gets an array of WorkOrderStatusesContract objects.
   * @property {async function(): Promise<void>} getAllList - Gets all the lists for
   *    OperationType, StationContract, CustomerContract, Contract, FlightStatusContract, and
   *    WorkOrderStatusesContract.
   */

    return {
        setOperationTypeList,
        getOperationTypeList,
        getOperationType,
        setStationList,
        getStationList,
        getStation,
        setCustomerList,
        getCustomerList,
        getCustomer,
        getAllList,
        setContractList,
        getContractList,
        getFlightStatusesList,
        setFlightStatusesList,
        getWorkOrderStatusesList,
        setWorkOrderStatusesList,
        getWorkOrderStatuses,
        getGatesList,
        setGatesList,
        getGates,
        getDataWorkOrderList,
        setDataWorkOrderList,
        getWorkOrders,
        getCustomerWithContract,
        getCustomerWithContractLists,
        setCustomerWithContractLists,
        setAirlinesList,
        getAirlinesList,
        setACTypesList,
        getACTypesList,
        setAirportsList,
        getAirportsList,
        setWorkOrderDelays,
        getWorkOrderDelays,
        setResponsible,
        getResponsible,
        getACTypes,
        getFavourites,
        getWorkOrderSearch,
        getFlightawareSearch,
        getSearchFlightNumber,
        getBillingClosedDate,
        getWorkOrderConditionally,
        getWorkOrdersItemsList,
        setPaxOperationTypeList,
        getPaxOperationTypeList,
        getPaxOperationType
    }
}
