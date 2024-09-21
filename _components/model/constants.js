import moment from 'moment'
import { i18n } from 'src/plugins/utils'
export const STEP_FLIGHT = 1;
export const STEP_SERVICE = 2;
export const STEP_REMARKS = 3;
export const STEP_SIGNATURE = 4;
export const STEP_DELAY = 3;
export const STATUS_DRAFT = 1; //No completed
export const STATUS_POSTED = 2;
export const STATUS_POSTING = 6;
export const STATUS_SUBMITTED = 3;
export const STATUS_CLOSED = 4;
export const STATUS_SCHEDULE = 5; //No completed
export const BUSINESS_UNIT_PASSENGER = 8;
export const BUSINESS_UNIT_FUELING = 9;
export const BUSINESS_UNIT_LABOR = 2;
export const BUSINESS_UNIT_SECURITY = 4;
export const BUSINESS_UNIT_RAMP = 'null';
export const COMPANY_PASSENGER = [30,33,34];
export const COMPANY_RAMP = [26,34];
export const COMPANY_SECURITY = [35,36];
export const NON_FLIGHT = 2;
export const FLIGHT = 1;
export const LABOR = 4;
export const FUELING = 3;
export const SECURITY = 5;
export const OPERATION_TYPE_OTHER = 6;
export const OPERATION_TYPE_NON_FLIGHT = [13, 6];
export const ADDITIONAL_FLIGHT_SERVICES = [STATUS_POSTED, STATUS_POSTING];
export const DEFAULT_STATION_ID = 28;

export const STATION_BNA = 33;
export const STATION_PBI = 50;
export const STATIONS_DELAY = [STATION_BNA, STATION_PBI]
export const OPERATION_TYPE_TURN_PASSENGER = 7
export const FIFTEEN_MINUTES = 15;
export const THIRTY_MINUTES = 30;
export const CODE_DELAY_99 = 77;
export const modelDataBound = {
    destinationAirport: {
        id: null,
    },
    originAirport: {
        id: null,
    },
    estimatedOff: null,
    registration: null,
    estimatedOn: null,
};
export const modelFlightBoundFormStatus = {
    boundOriginAirportId: true,
    boundTailNumber: true,
    boundScheduled: true,
    boundScheduledDeparture: true,
    boundDestinationAirport: true,
};

export const FlightformFieldModel = [
    'stationId',
    'acTypeId',
    'operationTypeId',
    'carrierId',
    'gateId',
    'statusId',
  ];
  export const FlightformFieldPassengerModel = [
    'stationId',
    'acTypeId',
    'operationTypeId',
    'carrierId',
    'statusId',
  ];

    export const FlightFormFieldSecurityModel = [
        'stationId',
        'acTypeId',
        'operationTypeId',
        'carrierId',
        'statusId',
    ];

  export const HalfTurnInBountModel = [
    'inboundFlightNumber',
    //'inboundOriginAirportId',
    //'inboundTailNumber',
    'inboundScheduledArrival',
  ];

  export const HalfTurnOutBountModel = [
    'outboundFlightNumber',
    //'outboundDestinationAirportId',
    //'outboundTailNumber',
    'outboundScheduledDeparture',
  ];

  export const HalfTurnInBountPassengerModel = [
    //'inboundFlightNumber',
    //'inboundOriginAirportId',
    //'inboundTailNumber',
    'inboundScheduledArrival',
    //'gateDestination',
  ];

  export const HalfTurnOutBountPassengerModel = [
    //'outboundFlightNumber',
    //'outboundDestinationAirportId',
    //'outboundTailNumber',
    'outboundScheduledDeparture',
    //'gateOrigin'
  ];

  export const modelWorkOrder = {
    "workdayTransactions": null,
    "carrierId": 0,
    "carrier": null,
    "stationId": 0,
    "station": null,
    "customerId": null,
    "customer": null,
    "acTypeId": null,
    "acType": null,
    "operationTypeId": 0,
    "operationType": null,
    "statusId": 5,
    "workOrderStatus": null,
    "inboundOriginAirportId": null,
    "inboundOriginAirport": null,
    "outboundDestinationAirportId": null,
    "outboundDestinationAirport": null,
    "contractId": null,
    "contract": null,
    "responsibleId": 0,
    "responsible": {
        "email": "soporte@imaginacolombia.com",
        "password": "***",
        "permissions": {
            "iflight.airline.manage": true,
            "iflight.airline.index": true,
            "iflight.airline.create": true,
            "iflight.airline.edit": true,
            "iflight.airline.destroy": true,
            "iflight.airline.restore": true,
            "iflight.airport.manage": true,
            "iflight.airport.index": true,
            "iflight.airport.create": true,
            "iflight.airport.edit": true,
            "iflight.airport.destroy": true,
            "iflight.airport.restore": true,
            "iflight.flight.manage": true,
            "iflight.flight.index": true,
            "iflight.flight.create": true,
            "iflight.flight.edit": true,
            "iflight.flight.destroy": true,
            "iflight.flight.restore": true,
            "iflight.flights.manage": true,
            "iflight.flights.index": true,
            "iflight.flights.create": true,
            "iflight.flights.edit": true,
            "iflight.flights.destroy": true,
            "iflight.flights.restore": true,
            "iflight.flight-statuses.manage": true,
            "iflight.flight-statuses.index": true,
            "iflight.flight-statuses.create": true,
            "iflight.flight-statuses.edit": true,
            "iflight.flight-statuses.destroy": true,
            "iflight.flight-statuses.restore": true,
            "ramp.work-orders.manage": true,
            "ramp.work-orders.index": true,
            "ramp.work-orders.index-all": true,
            "ramp.work-orders.edit": true,
            "ramp.work-orders.edit-status": true,
            "ramp.work-orders.edit-when-submitted": true,
            "ramp.work-orders.post": true,
            "ramp.work-orders.re-post": true,
            "ramp.work-orders.see-workday-transactions": true,
            "ramp.work-orders.see-contract-name": true,
            "ramp.work-orders.submit": true,
            "ramp.work-orders.bulk-post": true,
            "ramp.work-orders.bulk-submit": true,
            "ramp.work-orders.bulk-export-pdf": true,
            "ramp.work-orders.bulk-export-csv": true,
            "ramp.work-orders.create": true,
            "ramp.work-orders.destroy": true,
            "ramp.work-orders.manage-responsible": true,
            "ramp.work-orders.index-flight-positions": true,
            "ramp.work-order-schedules.manage": true,
            "ramp.work-order-schedules.index": true,
            "ramp.work-order-schedules.edit": true,
            "ramp.work-order-schedules.create": true,
            "ramp.work-order-schedules.destroy": true,
            "ramp.work-order-statuses.manage": true,
            "ramp.work-order-statuses.index": true,
            "ramp.work-order-statuses.edit": true,
            "ramp.work-order-statuses.create": true,
            "ramp.work-order-statuses.destroy": true,
            "ramp.work-order-delays.manage": true,
            "ramp.work-order-delays.index": true,
            "ramp.work-order-delays.edit": true,
            "ramp.work-order-delays.create": true,
            "ramp.work-order-delays.destroy": true,
            "ramp.workday-transactions.manage": true,
            "ramp.workday-transactions.index": true,
            "ramp.workday-transactions.edit": true,
            "ramp.workday-transactions.create": true,
            "ramp.workday-transactions.destroy": true,
            "ramp.schedule-statuses.manage": true,
            "ramp.schedule-statuses.index": true,
            "ramp.schedule-statuses.edit": true,
            "ramp.schedule-statuses.create": true,
            "ramp.schedule-statuses.destroy": true,
            "ramp.work-orders-comments.manage": true,
            "ramp.work-orders-comments.index": true,
            "ramp.work-orders-comments.create": true,
            "ramp.work-orders-comments.edit": true,
            "ramp.work-orders-comments.destroy": true,
            "ramp.work-orders-comments.restore": true,
            "ramp.categories.manage": true,
            "ramp.categories.index": true,
            "ramp.categories.edit": true,
            "ramp.categories.create": true,
            "ramp.categories.destroy": true,
            "setup.customers.manage": true,
            "setup.customers.index": true,
            "setup.customers.index-all": true,
            "setup.customers.edit": true,
            "setup.customers.create": true,
            "setup.customers.destroy": true,
            "ireport.report-types.manage": true,
            "ireport.report-types.index": true,
            "ireport.report-types.edit": true,
            "ireport.report-types.create": true,
            "ireport.report-types.destroy": true,
            "ireport.reports.manage": true,
            "ireport.reports.index": true,
            "ireport.reports.edit": true,
            "ireport.reports.create": true,
            "ireport.reports.destroy": true,
            "ireport.folders.manage": true,
            "ireport.folders.index": true,
            "ireport.folders.edit": true,
            "ireport.folders.create": true,
            "ireport.folders.destroy": true,
            "icomments.comments.manage": true,
            "icomments.comments.index": true,
            "icomments.comments.create": true,
            "icomments.comments.edit": true,
            "icomments.comments.destroy": true,
            "icomments.comments.restore": true
        },
        "allSettings": {},
        "socialData": {},
        "defaultInclude": "departments,roles",
        "allPermissions": {},
        "lastLogin": "2023-04-04T15:07:25.2214956",
        "fullName": "Imagina Offline Colombia",
        "firstName": "Imagina Offline",
        "lastName": "Colombia",
        "timezone": null,
        "language": null,
        "createdBy": null,
        "updatedBy": null,
        "deletedBy": null,
        "externalGuid": null,
        "roles": [],
        "departments": [],
        "folders": null,
        "reports": null,
        "id": 0,
        "createdAt": "2022-03-31T16:27:00.8359634",
        "updatedAt": "2023-04-04T15:07:25.3157749",
        "deletedAt": null,
        "restoredAt": null,
        "restoredBy": null,
        "externalId": null,
        "options": {
            "buildingsAssigned": [],
            "businessUnitType": "3",
            "stationsAssigned": [],
            "companyAssigned": null
        },
        "isReportable": false,
        "forceDelete": false,
        "searchableFields": "id,email,first_name,last_name",
        "fileFormats": null
    },
    "flightStatusId": 0,
    "flightStatus": null,
    "scheduleStatusId": null,
    "scheduleStatus": null,
    "workOrderItems": [],
    "gateId": 0,
    "gate": null,
    "companyId": 0,
    "company": null,
    "adHoc": null,
    "customCustomer": false,
    "inboundCustomFlightNumber": false,
    "needToBePosted": false,
    "customCustomerName": null,
    "remark": null,
    "delay": null,
    "safetyMessage": null,
    "customerSignature": null,
    "customerName": null,
    "customerTitle": null,
    "representativeSignature": null,
    "representativeName": null,
    "representativeTitle": null,
    "date": null,
    "referenceId": null,
    "inboundFlightNumber": null,
    "inboundTailNumber": null,
    "inboundScheduledArrival": null,
    "inboundBlockIn": null,
    "estimatedOnUtc": null,
    "inboundCargoTotalUldsUnloaded": null,
    "inboundCargoBulkUnloaded": null,
    "outboundFlightNumber": null,
    "outboundTailNumber": null,
    "outboundScheduledDeparture": null,
    "outboundBlockOut": null,
    "estimatedOffUtc": null,
    "calendarTitle": null,
    "outboundCustomFlightNumber": null,
    "outboundCargoTotalUldsLoaded": null,
    "outboundCargoBulkLoaded": null,
    "cargoTotalKilosLoaded": null,
    "cargoTotalKilosUnloaded": null,
    "preFlightNumber": null,
    "faFlightId": null,
    "faFlightStatus": null,
    "comments": 0,
    "sta": "23:12:00",
    "std": "12:31:00",
    "flightPosition": null,
    "isReportable": true,
    "transactions": null,
    "flightStatusColor": null,
    "id": null,
    "createdAt": moment().format('YYYY-MM-DDTHH:mm:ss'),
    "updatedAt": null,
    "deletedAt": null,
    "restoredAt": null,
    "createdBy": null,
    "updatedBy": null,
    "deletedBy": null,
    "restoredBy": null,
    "externalId": null,
    "options": null,
    "forceDelete": false,
    "defaultInclude": "customer,workOrderItems,workOrderItems.workOrderItemAttributes,gate,flightStatus",
    "searchableFields": "id,reference_id",
    "fileFormats": null
};

export const columnsFlightAware = [
  { name: 'tailNumber', label: 'Tail Number', field: 'registration', sortable: true , align: 'left'},
  { name: 'outbound', label: 'Departure', field: 'outbound' , align: 'left'},
  { name: 'inbound', label: 'Arrival ', field: 'inbound', align: 'left'},
  { name: 'aircraftType', label: 'Aircraft', field: 'aircraftType', align: 'left'}
]

export const columnsWorkOrders = [
  { 
    name: 'id', 
    label: 'ID', 
    field: 'id' , 
    align: 'left',
    format: (val, row) => {
      if (row.type === NON_FLIGHT) {
        return `
          <span>${val}</span>
          <span 
            class="
              tw-border 
              tw-py-0.5 
              tw-px-1 
              tw-rounded-md 
              tw-text-xs 
              tw-ml-2
            "
          />
            non-flight
          </span>
        `
      }
      return `<span>${val}</span>`
    },
  },
  { name: 'inboundFlightNumber', label: 'Inbound Flight Number', field: 'inboundFlightNumber', align: 'left'},
  { 
    name: 'inboundScheduledArrival', 
    label: 'Inbound Scheduled Arrival', 
    field: 'inboundScheduledArrival' , 
    align: 'left',
    format: (val) => (val ? i18n.trdT(val) : "-"),
  },
  { name: 'outboundFlightNumber', label: 'Outbound Flight Number', field: 'outboundFlightNumber' , align: 'left'},
  { 
    name: 'outboundScheduledDeparture', 
    label: 'Outbound Scheduled Departure', 
    field: 'outboundScheduledDeparture' , 
    align: 'left',
    format: (val) => (val ? i18n.trdT(val) : "-"),
  },
  { 
    name: 'scheduleDateLocal', 
    label: 'Service Date Created', 
    field: 'scheduleDateLocal', 
    align: 'left',
    format: (val) => (val ? i18n.trdT(val) : "-"),
  }
]

export const modalFullProps = {
  title: '',
  update: true,
  workOrderId: null,
  width: '90vw',
}
