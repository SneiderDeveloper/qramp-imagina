import { cache } from 'src/plugins/utils'
import qRampStore from '../../../_store/qRampStore'
import { 
    BUSINESS_UNIT_RAMP, 
    BUSINESS_UNIT_PASSENGER, 
    BUSINESS_UNIT_SECURITY, 
} from '../../model/constants'
import { computed } from 'vue'

const BASE_URL = 'https://delightful-ground-0eae6c50f.4.azurestaticapps.net/docs/documentation'

const getToken = async () => {
    try {
        const sessionData = await cache.get.item('sessionData')
        return sessionData.userToken.split(' ')[1]
    } catch (error) {
        console.log(error)
    }
}

const routes = {
    [BUSINESS_UNIT_RAMP]: 'ramp-module',
    [BUSINESS_UNIT_PASSENGER]: 'passenger-module',
    [BUSINESS_UNIT_SECURITY]: 'security-module',
}

const token = await getToken()

export const help = () => {
    const path = routes[qRampStore().getBusinessUnitId() || 0]

    const schedule = computed(() => ({
        title: 'Schedule',
        description: `
            Need help? Check the
            <a 
                href='${BASE_URL}/${path}/schedule?token=${token}' 
                target='_blank'
                class='tw-text-blue-500'>
                documentation
            </a>
            for more information on how to use the schedule.
        `
    }))

    const create = computed(() => ({
        title: 'Create an Work Order',
        description: `
            Need help? Check the
            <a 
                href='${BASE_URL}/${path}/schedule#create-an-schedule?token=${token}' 
                target='_blank'
                class='tw-text-blue-500'>
                documentation
            </a>
            for more information on creating Work Orders.
        `
    }))

    return { 
        schedule,
        create,
    }
}