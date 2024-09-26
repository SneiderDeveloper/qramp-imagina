import flight from '../../components/flight.vue';
import serviceList from '../../../serviceList/index.vue';
import remarks from '../../../remarks/index.vue';
import { ref, markRaw } from 'vue';
import signature from '../../../signature/signature.vue'
import { configEntity } from './entitiesConfig';

export default ref([
    {
      refs: 'refFlight',
      title: 'Flight',
      icon: 'fa-regular fa-plane',
      step: 1,
      component: markRaw(configEntity.componentFlight),
      error: false,
      done: false,
    },
    {
      refs: 'refServices',
      title: 'Services',
      icon: 'fa-regular fa-briefcase-blank',
      step: 2,
      component: markRaw(serviceList),
      error: false,
      done: false,
    },
    {
      refs: 'refRemark',
      title: 'Remark',
      icon: 'fa-regular fa-comment-dots',
      step: 3,
      component: markRaw(remarks),
      error: false,
      done: false,
    },
    {
      ref: "signature",
      title: 'Signature',
      icon: 'fa-solid fa-pen-line',
      step: 4,
      component: markRaw(signature),
      error: false,
      done: false,
      disable: true
    }
  ]).value.filter(step => !configEntity.stepsIgnore?.includes(step.step))
