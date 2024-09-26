import { BUSINESS_UNIT_SECURITY, BUSINESS_UNIT_FUELING } from 'src/modules/qramp/_components/model/constants.js'
import qRampStore from 'src/modules/qramp/_store/qRampStore'

const STEP_SIGNATURE = 4

const entitiesConfig = {
    [BUSINESS_UNIT_FUELING]: {
        componentFlightPath: 'src/modules/qramp/_components/flight/flight.vue',
        storeRoute: 'src/modules/qramp/_components/flight/store.ts'
    },
    [BUSINESS_UNIT_SECURITY]: {
        componentFlightPath: 'src/modules/qramp/_components/flightSecurity/index.vue',
        storeRoute: 'src/modules/qramp/_components/flightSecurity/store.ts',
        ignoreSteps: [STEP_SIGNATURE]
    }
}

const entityConfig = entitiesConfig[4]

console.log(qRampStore().getBusinessUnitId())
console.log(entityConfig)

export const configEntity = {
    // componentFlight: import(entityConfig.componentFlightPath),
    componentFlight: import('../../../flightSecurity/index.vue'),
    // store: import(entityConfig.storeRoute),
    store: import('../../../flightSecurity/store'),
    stepsIgnore: entityConfig.ignoreSteps
}