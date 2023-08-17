import Vue, { computed, ref, onMounted } from 'vue';
import storeKanban from '../store/kanban.store';
import moment from 'moment'
import getWorkOrder from '../actions/getWorkOrder'
import getIndividualWorkOrders from '../actions/getIndividualWorkOrders';
import updateWorkOrder from '../actions/updateWorkOrder'

export default function useKanbanColumn(props: any = {}) {
  const isLoading = ref(false);
  const cards: any = computed({
    get: () => props.column.cards,
    set: (value) => (props.column.cards = value),
  });
  const date = computed(() => props.column.date)
  const selectedDate = computed({
    get: () => storeKanban.selectedDate,
    set: (value) => (storeKanban.selectedDate = value),
  });
  const isDraggingCard = computed({
    get: () => storeKanban.isDraggingCard,
    set: (value) => (storeKanban.isDraggingCard = value),
  });
  const cardHours = computed(() => {
    return (index, card, cards) => index !== 0
      && moment(card.scheduleDate).format('HH') === moment(cards[index - 1].scheduleDate).format('HH')
  })
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
  async function singleFefreshed(columnDate) {
    props.column.cards = [];
    const page = 1;
    props.column.loading = true
    const scheduleDate = columnDate || date.value;
    const response = await getIndividualWorkOrders(true, page,  scheduleDate);
    props.column.page = page;
    props.column.cards = response.data;
    props.column.loading = false;
  }
  function setDrag(isDrag = false) {
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
    column.loading = true;
    const card = column.cards.find(item => item.id == event.item.id);
    if(!card) return;
    const arrivalHour = moment(card.inboundScheduledArrival).format('HH:MM');
    const departureHour = moment(card.outboundScheduledDeparture).format('HH:MM');
    const sheduleDateColumn = moment(event.to.id).format('MM/DD/YYYY');
    const attributes = {
      id: event.item.id,
      inboundScheduledArrival: card.inboundScheduledArrival ? `${sheduleDateColumn} ${arrivalHour}`: null,
      outboundScheduledDeparture: card.outboundScheduledDeparture ? `${sheduleDateColumn} ${departureHour}`: null 
    }
    column.cards = [];
    await updateWorkOrder(event.item.id, attributes);
    column.page = 1;
    const response = await getIndividualWorkOrders(true, column.page,  moment(event.to.id));
    column.cards = response.data;
    column.loading = false;
  }
  onMounted(() => {
    const observerOptions = {
      root: document.querySelector(`.cardCtn-${date.value}`),
    };
    const target: any = document.querySelector(`.trigger-${date.value}`);
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    observer.observe(target);
  })
  return {
    selectedDate,
    isDraggingCard,
    cardHours,
    isLoading,
    cards,
    date,
    singleFefreshed,
    setDrag,
    changeDate,
  }
}