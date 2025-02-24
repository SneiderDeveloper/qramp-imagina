import { computed } from 'vue';
import storeKanban from '../store/kanban.store';

import qRampStore from './../../../_store/qRampStore.js'
import scheduleTypeModel from '../models/scheduleType.model';
import { Screen } from 'quasar'
import devicesModel from '../models/devices.model';

export default function useKanbanCardActions(props: any = {}) {
  const isBlank = computed(() => storeKanban.isBlank);
  const isPassenger = computed(() => qRampStore().getIsPassenger());

  const isMobile = computed(() => Screen.width < devicesModel.mobile.maxWidth );
  const isTablet = computed(() => Screen.width >= devicesModel.mobile.maxWidth  && Screen.width < devicesModel.tablet.maxWidth);
  const isDesktop = computed(() => Screen.width >= devicesModel.tablet.maxWidth );
  const showKanbanCardsActions = computed(() => (storeKanban.scheduleType == scheduleTypeModel[1].value) && !isBlank.value )

  const cardComponentName = computed(() => {
    const kanbanCardTabletComponentName = 'kanbanCardTablet';
    const kanbanCardDesktopComponentName = 'kanbanCardDesktop';
    if (isTablet.value) return kanbanCardTabletComponentName
    return kanbanCardDesktopComponentName;
  })

  return {
    isBlank,
    isPassenger,
    isMobile,
    isTablet,
    isDesktop,
    showKanbanCardsActions,
    cardComponentName
  };
}
