import { computed } from 'vue';
import { store as pluginStore, alert } from 'src/plugins/utils'
import store from '../store/modalSchedule.store'
import getCurrentColumn from '../actions/getCurrentColumn';
import storeKanban from '../store/kanban.store'
import crud from 'modules/qcrud/_services/baseService'

export default function useModalComment(props) {
  const visible = computed({
    get: () => store.showModalComments,
    set: (value) => store.showModalComments = value
  });

  const loading = computed({
    get: () => store.loading,
    set: (value) => store.loading = value
  });

  const isAppOffline = computed(() => storeKanban.isAppOffline)
  const permisionCommentsIndex = computed(() => pluginStore.hasAccess(`ramp.work-orders-comments.index`))

  function showModalComments() {
    if(!permisionCommentsIndex.value) {
        alert.warning({message: 'You do not have permission to view comments'});
      return;
    }
    visible.value = true;
  }

  async function hideModalComments() {
    loading.value = false;
    visible.value = false;
    try {
      const workOrderId = props.commentableId
      const col = getCurrentColumn()
      const card = col.cards.find((card) => card.id == workOrderId)
      if (card) {
        const response = await crud.show("apiRoutes.qramp.workOrders", workOrderId, {
          refresh: true
        })
        card.comments = response.data.comments;
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    visible,
    isAppOffline,
    permisionCommentsIndex,
    showModalComments,
    hideModalComments,
    loading
  }
}
