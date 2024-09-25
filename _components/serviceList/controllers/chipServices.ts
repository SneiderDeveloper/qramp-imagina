import { ref, watch, computed, ComputedRef } from 'vue';
import serviceListStore from '../store/serviceList';
import findDynamicFieldTitle from '../services/findDynamicFieldTitle';
import searchAndCreateDynamicField from '../services/searchAndCreateDynamicField';
import deleteChipRecursive from '../services/deleteChipRecursive';
import { store } from 'src/plugins/utils'
import baseService from 'modules/qcrud/_services/baseService.js'

const chipServicesController = (props: any = {}, emit: any = null) => {
    let lists: any = ref([]);
    const popupProxyRef: any = ref(null);
    const favouritesList: any = computed(() => {
        const serviceList: any[] = searchAndCreateDynamicField(serviceListStore().getServiceList());
        return serviceListStore().getFavouriteList().filter(item => serviceList.map(service => service.id).includes(item.productId));
    })
    const isAppOffline = computed(() => store.state.qofflineMaster.isAppOffline);
    const permissionFavourite = computed(() => ({
        create: store.hasAccess('isite.favourites.create'),
        edit: store.hasAccess('isite.favourites.edit'),
        index: store.hasAccess(`isite.favourites.index`),
        destroy: store.hasAccess(`isite.favourites.destroy`),
    }));
    const showFavourite: ComputedRef<boolean> = computed(() => serviceListStore().getShowFavourite());
    const nameProduct = (productId: string) => {
        return findDynamicFieldTitle(serviceListStore().getServiceList(), productId);
    }
    const updateLists = async () : Promise<void> => {
        lists.value = await serviceListStore().getServiceListSelected();
        lists.value.forEach(list => {
          const workOrderItemAttributes = list.work_order_item_attributes || [];
          workOrderItemAttributes.forEach(async item => {
            if(item.type === 'select' && Array.isArray(JSON.parse(item.value))) {
              const response = await baseService.index('apiRoutes.qsetupagione.employees', {
                params: {
                  filter:{
                    id: JSON.parse(item.value)
                  }
                }
              })
              item.value = response.data.map((item) => item.name)
            }
          })
        })
    }

    function deleteChip(productId: string): void {
        deleteChipRecursive(productId, serviceListStore().getServiceList());
    }

    function searchProduct(productId: string): void {
        emit('search', nameProduct(productId))
        popupProxyRef.value.hide();
    }

    function favourites(): void {
        serviceListStore().setShowFavourite(!showFavourite.value)
    }

    updateLists().then();
    watch(
        () => serviceListStore().getServiceListSelected(),
        () => {
            updateLists().then();
        }
    );

    return {
        lists,
        nameProduct,
        deleteChip,
        popupProxyRef,
        searchProduct,
        showFavourite,
        favouritesList,
        favourites,
        permissionFavourite,
        isAppOffline
    }
}
export default chipServicesController;
