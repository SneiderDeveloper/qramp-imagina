import { computed, inject } from 'vue';
import modalScheduleStore from '../store/modalSchedule.store'
import storeKanban from '../store/kanban.store'
import _ from "lodash";
import getCurrentColumn from '../actions/getCurrentColumn';
import qRampStore from 'src/modules/qramp/_store/qRampStore';
import { FLIGHT, LABOR, NON_FLIGHT } from 'src/modules/qramp/_components/model/constants'
import modalNonFlightStore from 'src/modules/qramp/_components/modalNonFlight/store/index.store'
import { i18n } from 'src/plugins/utils'

export default function useCompletedSchedule(props: any, emit: any) {
  const isBlank = computed(() => storeKanban.isBlank);
  const scheduleType = computed(() => props.scheduleType);
  const dateColumn = computed(() => props.column.date.format('YYYY-MM-DD'));
  const cards = computed(() => props.column.cards)
  const isPassenger = computed(() => qRampStore().getIsPassenger())
  const refModalNonFlight: any = inject('refModalNonFlight')
  const dropdownItems = [
    { label: 'Create Flight', action: () => openForm(FLIGHT) },
    { label: 'Create Non-flight', action: () => openForm(NON_FLIGHT) },
  ]

  const showInline = computed(()=> modalScheduleStore.showInline)
  const modalShowSchedule = computed({
    get: () => modalScheduleStore.showModal,
    set: (value: boolean) => modalScheduleStore.showModal = value
  })
  const modalTitleSchedule = computed({
    get: () => modalScheduleStore.titleModal,
    set: (value: string) => modalScheduleStore.titleModal = value
  })

  const openModalNonFlight = () => {
    modalNonFlightStore.seletedDateColumn = dateColumn.value;
    modalScheduleStore.seletedDateColumn = dateColumn.value;
    modalNonFlightStore.stationId = modalScheduleStore.stationId;
    refModalNonFlight.value.handleModalChange()
  }

  const openForm = (typeWorkOrder: number | null) => {
    const isNonFlight = typeWorkOrder === NON_FLIGHT
    if (props.isWeekAgenda) isNonFlight ? openModalNonFlight() : openModalForm()
    if (!props.isWeekAgenda) isNonFlight ? openModalNonFlight() : openInlineForm()
    if (typeWorkOrder) qRampStore().setTypeWorkOrder(typeWorkOrder);
  }
  const completed = computed(() => props.column.completed)
  const uncompleted = computed(() => props.column.uncompleted)  

  const createNonFlight = computed(() => {
    return  !isBlank.value && 
            !showInline.value && 
            isPassenger.value && 
            qRampStore().getTypeWorkOrder() !== LABOR
  })

  const createFlight = computed(() => {
    return !isBlank.value && !showInline.value
  })
  
  function openModalForm() {
    modalScheduleStore.isEdit = false;
    modalShowSchedule.value = true;
    modalTitleSchedule.value = `Create schedule date: ${dateColumn.value}`;
    modalScheduleStore.seletedDateColumn = dateColumn.value;
  }

  function openInlineForm() {
    modalScheduleStore.isEdit = false;
    modalScheduleStore.showInline = true;
    modalScheduleStore.seletedDateColumn = dateColumn.value;
    const dummyCard = {
      id: false,
      editable: true,
      statusId: null,
    }
    const col = getCurrentColumn()
    col.cards.unshift(dummyCard)
  }

  function refresh() {
    modalScheduleStore.showInline = false; // forces to close the scheduleForm
    emit('refresh');
  }
  return {    
    scheduleType,
    modalShowSchedule,
    refresh,
    openModalForm,
    isBlank,
    openInlineForm,
    showInline,
    openForm,
    completed,
    uncompleted,
    cards,
    isPassenger,
    FLIGHT,
    NON_FLIGHT,
    createNonFlight,
    createFlight,
    dropdownItems,
    i18n
  }
}