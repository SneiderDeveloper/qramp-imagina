import {computed } from 'vue';
import storeKanban from '../store/kanban.store';
import {
  STATUS_DRAFT,
  STATUS_CLOSED,
  STATUS_POSTED,
  STATUS_SUBMITTED,
  STATUS_SCHEDULE,
  NON_FLIGHT,
} from '../../model/constants.js';
import workOrderList from '../../../_store/actions/workOrderList';
import qRampStore from './../../../_store/qRampStore.js'
import moment from 'moment';

export default function useKanbanCard(props: any = {}) {
  const isBlank = computed(() => storeKanban.isBlank);
  const isPassenger = computed(() => qRampStore().getIsPassenger());
  const colorCheckSchedule = computed(() => {
    const statusColor: string | undefined = workOrderList()
      .getWorkOrderStatusesList()
      .find(status => status.id === Number(props.card.statusId))?.color;
    const color = statusColor ? `tw-border-${statusColor}` : 'tw-border-gray-200';
    return color;
  })
  const flightStatuses = computed(() => {
    const flightStatuses: any =
      workOrderList()
        .getFlightStatusesList()
        .find(status => status.id === Number(props.card.flightStatusId));
    const color = flightStatuses ? `tw-text-${flightStatuses.color}` : 'tw-text-gray-400';
    const icon = flightStatuses?.icon || 'fa-solid fa-circle-question';
    return flightStatuses ? { name: flightStatuses.name, color, icon } : { name: 'Unknown', color, icon: 'fa-solid fa-circle-question' };
  })
  const actypes = computed(() => {
    const actypesList: any =
      workOrderList()
      .getACTypesList()
        .find(ac => ac.id === Number(props.card.acTypeId));
    return actypesList ? actypesList.fullName : '';
  })
  const gates = computed(() => {
    if(props.card.calendar?.gate && isPassenger.value) {
      if(props.card.calendar.gate.trim().length !== 0 ) return props.card.calendar.gate
    }
    const gateList: any =
      workOrderList()
      .getGatesList()
        .find(gate => gate.id === Number(props.card.gateId));
    return gateList ? `${gateList.name}` : null;
  })
  const titleStatus = computed(() => {
    const statuses = {
      [STATUS_DRAFT]: 'Draft',
      [STATUS_CLOSED]: 'Closed',
      [STATUS_POSTED]: 'Posted',
      [STATUS_SUBMITTED]: 'Submitted',
      [STATUS_SCHEDULE]: 'Scheduled',
    };
    return statuses[props.card.statusId] || '';
  })

  const isNonFlight = computed(() => props.card.type === NON_FLIGHT)

  return {
    colorCheckSchedule,
    titleStatus,
    flightStatuses,
    actypes,
    gates,
    isBlank,
    isPassenger,
    storeKanban,
    isNonFlight,
    moment
  };
}
