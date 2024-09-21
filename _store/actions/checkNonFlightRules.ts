import { ADDITIONAL_FLIGHT_SERVICES } from '../../_components/model/constants'
import moment from 'moment-timezone'
import qRampStore from '../qRampStore'

export const checkNonFlightRules = (flight) => {
  return false
    if (!flight) return

    const DATE_FORMAT = 'YYYY-MM-DD'
    const lastBillingClosedDate = qRampStore().getBillingDate()

    if (!lastBillingClosedDate && !flight.statusId) {
      return true
    }

    const isInStatusRange = ADDITIONAL_FLIGHT_SERVICES.includes(flight.statusId)

    const scheduleDateLocal = moment(flight.scheduleDateLocal, DATE_FORMAT)
    const lastBillingClosedDateFormatMoment = moment(lastBillingClosedDate, DATE_FORMAT)

    const openBillingDate =  scheduleDateLocal.isSameOrBefore(lastBillingClosedDateFormatMoment)

    if (!openBillingDate && !isInStatusRange) {
      return true
    }
}