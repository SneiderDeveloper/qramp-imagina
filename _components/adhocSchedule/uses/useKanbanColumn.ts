import { computed, ref, onMounted, provide } from 'vue';
import storeKanban from '../store/kanban.store';
import storeFilters from '../store/filters.store'
import moment from 'moment'
import getIndividualWorkOrders from '../actions/getIndividualWorkOrders';
import validateOperationType from '../actions/validateOperationType'
import scheduleTypeModel from '../models/scheduleType.model';
import devicesModel from '../models/devices.model';
import buildKanbanStructure from '../actions/buildKanbanStructure';
import setUrlParams from '../actions/setUrlParams';
import { Screen } from 'quasar';

export default function useKanbanColumn(props: any = {}) {
  provide('singleRefreshmentColumn', singleRefreshment);
  const isLoading = ref(false);
  const refKanbanColumn = ref(null);
  const refTrigger = ref(null);
  const cards: any = computed({
    get: () => props.column.cards,
    set: (value) => (props.column.cards = value),
  });
  const isBlank = computed(() => storeKanban.isBlank);
  const isWeekAgenda = computed(() => storeKanban.scheduleType == scheduleTypeModel[0].value );

  const cardComponentName = computed(() => {
    const kanbanCardComponentName = 'kanban-card';
    const kanbanDayComponentName = 'kanban-day';
    if (
      (storeKanban.scheduleType == scheduleTypeModel[1].value) &&
      ( Screen.width > devicesModel.mobile.maxWidth )
    ) return kanbanDayComponentName;
    return kanbanCardComponentName;
  })

  const date = computed(() => props.column.date)
  const selectedDate = computed({
    get: () => storeFilters.selectedDate,
    set: (value) => (storeFilters.selectedDate = value),
  });
  const isDraggingCard = computed({
    get: () => storeKanban.isDraggingCard,
    set: (value) => (storeKanban.isDraggingCard = value),
  });
  const cardHours = computed(() => {
    return (index, card, cards) =>  {
      const lastCard = moment(cards[index - 1].scheduleDate).format('HH')
      const selectedCard = moment(card.scheduleDate).format('HH')

      return index !== 0 && selectedCard === lastCard
    }
  })

  async function showKanbanDay(){
    /* only on week-agenda */
    if(storeKanban.scheduleType == scheduleTypeModel[0].value) {
      props.column.loading = true;
      storeKanban.columns = [];
      storeFilters.selectedDate = date.value.format('YYYY/MM/DD');
      storeFilters.scheduleType = scheduleTypeModel[1].value;
      storeKanban.scheduleType = storeFilters.scheduleType;
      await buildKanbanStructure();
      props.column.loading = false;
      setUrlParams();
    }
  }

  function observerCallback(entries) {
    entries.forEach(({ isIntersecting }) => {
      if (isIntersecting) {
        infiniteHandler();
      }
    });
  }
  async function infiniteHandler() {
    try {
      if(props.column.loading || props.column.total === cards.value.length) return;
      isLoading.value = true;
      props.column.page = props.column.page + 1;
      const response = await getIndividualWorkOrders(true, props.column.page, date.value);
      cards.value.push(...response.data);
      isLoading.value = false;
    } catch (error) {
      console.log(error);
      isLoading.value = false;
    }
  }

  async function singleRefreshment(columnDate = null) {
    try {
      props.column.cards = [];
      const page = 1;
      props.column.loading = true
      const scheduleDate = columnDate || date.value;
      const response = await getIndividualWorkOrders(true, page,  scheduleDate);
      props.column.page = page;
      props.column.cards = response.data;
      props.column.loading = false;
    } catch (error) {
      console.log(error);
      props.column.loading = false;
    }
  }
  function setDrag(isDrag = false) {
    if(isBlank) return;
    storeKanban.columns.forEach(item => {
      if(isDrag && props.column.date === item.date) {
        item.isDrag = isDrag
      } else {
        item.isDrag = false
      }

    })
  }
  async function changeDate(event) {
    if (event.from.id === event.to.id) return;
    const column: any = storeKanban.columns.find(item => {
      return item.date.format('YYYY-MM-DD') === event.to.id
    });
    if(!column) return;
    try {
      column.loading = true;
      const card = column.cards.find(item => String(item.id) === String(event.item.id));
      if(!card) return;
      const attributes = updateTransportScheduleChanges(card, event);
      column.cards = [];
      column.page = 1;
      const response = await getIndividualWorkOrders(
        true,
        column.page,
        moment(event.to.id)
      );
      column.cards = response.data;
      column.loading = false;
    } catch (error) {
      console.log(error);
      column.loading = false;
    }
  }
  function updateTransportScheduleChanges(card, event) {
    const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
    let arrival: any = moment(card.inboundScheduledArrival, DATE_FORMAT);
    let departure: any = moment(card.outboundScheduledDeparture, DATE_FORMAT);
    const sheduleDateColumn = moment(event.to.id, 'YYYY-MM-DD');
    const isbound = validateOperationType(card.operationTypeId);
    if(isbound.inbound && !isbound.outbound) {
      arrival = `${sheduleDateColumn.format('MM/DD/YYYY')} ${arrival.format('HH:mm')}`;
      departure = null;
    }
    if(!isbound.inbound && isbound.outbound) {
      arrival = null;
      departure = `${sheduleDateColumn.format('MM/DD/YYYY')} ${departure.format('HH:mm')}`;
    }
    if(isbound.inbound && isbound.outbound) {
      const daysDifference = sheduleDateColumn.diff(arrival, 'days');
      departure.add(daysDifference, 'days');
      arrival = `${sheduleDateColumn.format('MM/DD/YYYY')} ${arrival.format('HH:mm')}`;
      departure = departure.format('MM/DD/YYYY HH:mm');
    }
    return {
      id: event.item.id,
      inboundScheduledArrival: card.inboundScheduledArrival && arrival ? arrival : null,
      outboundScheduledDeparture: card.outboundScheduledDeparture && departure ? departure : null
    }
  }
  onMounted(() => {
    const observerOptions = {
      root: refKanbanColumn.value,
    };
    const target: any = refTrigger.value;
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    if (target) observer.observe(target);
  })
  return {
    selectedDate,
    storeKanban,
    isDraggingCard,
    cardHours,
    isLoading,
    cards,
    date,
    singleRefreshment,
    setDrag,
    changeDate,
    isBlank,
    isWeekAgenda,
    showKanbanDay,
    cardComponentName,
    refKanbanColumn,
    refTrigger,
    moment
  }
}
