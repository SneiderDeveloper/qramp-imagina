import cargo from '../../cargo/index.vue';
import {reactive, nextTick} from 'vue';
import {
    buildServiceList,
    getListOfSelectedServices
} from '../../../_store/actions/services';
import {
    ServiceModelContract,
    ServiceListStoreContract,
    ReactiveStoreContract,
} from '../contracts/index.contract';
import qRampStore from '../../../_store/qRampStore';
import _ from 'lodash';
import { BUSINESS_UNIT_SECURITY } from "src/modules/qramp/_components/model/constants";

const dataModel: ServiceModelContract[] = [
    {
        id: 4,
        title: 'Cargo',
        component: cargo,
    },
];
const state = reactive<ReactiveStoreContract>({
    serviceList: [],
    loading: false,
    favouriteList: [],
    showFavourite: false,
    errorList: [],
    breadcrumbs: [],
    selectService: {},
});


/**
 * @author Wilmer Ramiro Cristancho
 * The loading state is
 * @returns An object with the following properties:
 * getServiceData
 * setServiceList
 * getServiceList
 * setLoading
 * getLoading
 * resetStore
 * init
 */

export default function serviceListStore(): ServiceListStoreContract {
    /**
     *
     * @returns getServiceData
     */
    async function getServiceData(): Promise<void> {
        try {
            const response = (await buildServiceList() as Array<any>).filter(item => item.id !== 4);
            let serviceList = [...response, ...dataModel].filter(item => {
                if(qRampStore().getIsPassenger() || qRampStore().getBusinessUnitId() === BUSINESS_UNIT_SECURITY) {
                    return item.id !== 4;
                }
                return item;
            });
            setServiceList(serviceList);
        } catch (error) {
            console.log(error);
        }
    }

    function setServiceList(value: ServiceModelContract[]): void {
        state.serviceList = value;
    }


    function getServiceList(): ServiceModelContract[] {
        return state.serviceList;
    }

    function getBreadcrumbs(): any[] {
        return state.breadcrumbs;
    };

    function setBreadcrumbs(value: any[]): void {
        state.breadcrumbs = value;
    }

    function getFavouriteList(): any[] {
        return state.favouriteList;
    }

    function setSelectService(value: ServiceModelContract): void {
        state.selectService = value;
    }

    function getSelectService(): ServiceModelContract {
        return state.selectService;
    }

    function removeFromFavouriteList(id) {
        state.favouriteList = state.favouriteList.filter(item => item.productId !== id);
    }

    function pustFavouriteList(data) {
        state.favouriteList.push(data);
    }

    function setFavouriteList(value: any): void {
        state.favouriteList = value;
    }

    function getShowFavourite(): boolean {
        return state.showFavourite;
    };
    function setShowFavourite(value: boolean): void {
        state.showFavourite = value;
    }
    function setErrorList(value: any): void {
        state.errorList = value;
    };

    function getErrorList() {
        return state.errorList;
    }

    /**
     * This function takes a boolean value and sets the loading property of the state object to that
     * value.
     * @param {boolean} value - boolean - The value to set the loading state to.
     */
    function setLoading(value: boolean): void {
        state.loading = value;
    }

    /**
     * This function returns a boolean value that is the value of the loading property of the state
     * object.
     * @returns The loading state.
     */
    function getLoading(): Boolean {
        return state.loading;
    }

    /**
     * The function is called resetStore and it takes no parameters and returns nothing.
     */
    function resetStore(): void {
        setServiceList([]);
        setBreadcrumbs([]);
        setSelectService({});
    }

    async function getServiceListSelected(isType = false): Promise<any> {
        const services = state.serviceList
            .filter(item => item.id !== 4);
        return await orderServicesWithTheStructureToSave(services, isType);
    }


    function getAllServices(services: ServiceModelContract[]): ServiceModelContract[]  {
        const servicesData: any = [];
        services.forEach(obj => {
            const item: any = _.cloneDeep(obj);
            if (item.dynamicField) {
                servicesData.push(item);
            }
            if (item.lists) {
                item.lists.forEach(list => {
                    const listServicesData = getAllServices([list]);
                    servicesData.push(...listServicesData);
                });
            }
        });

        return servicesData;
    }
    /**
     * It takes an array of objects, and for each object, it calls a function that returns an array of
     * objects, and then pushes the returned array of objects to the data array.
     * @param services
     * @returns An array of promises.
     */
    async function orderServicesWithTheStructureToSave(services: ServiceModelContract[], isType = false): Promise<any> {
        try {
            const data: any = [];
            const allServices = getAllServices(services);
            allServices.forEach(async service => {
                const dynamicField = await getListOfSelectedServices(service.dynamicField || [], isType);
                await data.push(...dynamicField);
            })
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Get the service list, filter it by the category id, then order the services with the structure
     * to save.
     * @returns {Promise<ServiceModelContract[]>} An array of ServiceModelContract objects.
     */
    async function getServiceItems(isType = false): Promise<ServiceModelContract[]> {
        const serviceList = getServiceList();
        return await orderServicesWithTheStructureToSave(serviceList, isType);
    }

    /**
     * The loading state is set to true before the data is fetched because the nextTick function is
     * called before the getServiceData function is called.
     * The loading state is set to false after the data is fetched because the getServiceData function
     * is called before
     */
    async function init(): Promise<void> {
        nextTick(async () => {
            setLoading(true);
            await getServiceData();
            setLoading(false);
        })
    }


    async function filterServicesListByQuantity(): Promise<any> {
       let serviceList = await getServiceListSelected(true);
       serviceList = serviceList.filter(item => {
        if (item.product_type == 2 || item.product_type == 3) {
            return item.work_order_item_attributes.some(attr => attr.value === null ||
              attr.value === undefined);
        }
        return false;
       })
       setErrorList(serviceList);
       return serviceList;
    }

    return {
        getServiceData,
        setServiceList,
        getServiceList,
        setLoading,
        getLoading,
        resetStore,
        init,
        getServiceListSelected,
        orderServicesWithTheStructureToSave,
        getServiceItems,
        getFavouriteList,
        setFavouriteList,
        removeFromFavouriteList,
        pustFavouriteList,
        getShowFavourite,
        setShowFavourite,
        filterServicesListByQuantity,
        setErrorList,
        getErrorList,
        getBreadcrumbs,
        setBreadcrumbs,
        getSelectService,
        setSelectService,
    }
}
