const moduleName = 'ramp';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`

const setupModuleName = 'setup';
const setupUrlBase = `/${setupModuleName}/${moduleVersion}`


export default {
  urlBase: urlBase,
  version: moduleVersion,
  workOrders: `${urlBase}/work-orders`,
  workOrderStatuses: `${urlBase}/work-order-statuses`,
  operationTypes: `${urlBase}/operation-types`,
  setupContracts: `${setupUrlBase}/contracts`,
  setupCustomers: `${setupUrlBase}/customers`,
  setupCompanies: `${setupUrlBase}/companies`,
  setupBuildings: `${setupUrlBase}/buildings`,
  setupStations: `${setupUrlBase}/stations`,
  products: `${urlBase}/products`,
  attributes: `${urlBase}/attributes`,
  workOrderTransactions: `${urlBase}/workday-transactions`,
}
