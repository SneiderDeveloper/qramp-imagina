import { ref, computed } from 'vue';
import serviceListStore from '../../serviceList/store/serviceList'
import findDynamicFieldTitle from '../../serviceList/services/findDynamicFieldTitle'
import getWorkOrderItemsActions from '../actions/getWorkOrderItems'
import qRampStore from "src/modules/qramp/_store/qRampStore";
import baseService from 'modules/qcrud/_services/baseService.js'

const chipServicesController = (props: any = {}, emit: any = null) => {
    const workOrderItemsTotal = computed(() => props.workOrderItemsTotal)
    const loading = ref(false);
    const workOrdersItems: any = ref([]);
    const popupProxyRef: any = ref(null);
    const nameProduct = (productId) => {
        return findDynamicFieldTitle(serviceListStore().getServiceList(), productId);
    }
    async function getWorkOrderItems() {
        try {
            workOrdersItems.value = [];
            loading.value = true;
            const response = await getWorkOrderItemsActions(props.workOrderId);
            workOrdersItems.value = response.data;
            workOrdersItems.value.forEach(list => {
              const workOrderItemAttributes = list.workOrderItemAttributes || [];
              workOrderItemAttributes.forEach(async item => {
                if(item.name === 'Employees' && Array.isArray(item.value)) {
                  const response = await baseService.index('apiRoutes.qsetupagione.employees', {
                    params: {
                      filter:{
                        id: item.value
                      }
                    }
                  })
                  item.value = response.data.map((item) => item.name)
                }
              })
            })
            await qRampStore().setTypeWorkOrder(props.typeWorkOrder);
            await serviceListStore().init();
            loading.value = false
        } catch (error) {
            console.error(error)
        }
    }
    return {
        nameProduct,
        popupProxyRef,
        workOrderItemsTotal,
        workOrdersItems,
        getWorkOrderItems,
        loading
    }
}
export default chipServicesController;
