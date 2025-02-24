import {WorkOrders} from '../contracts/getWorkOrder.contract'
import filtersStore from '../store/filters.store'
import dataReturnedWorkOrder from '../models/dataReturnedWorkOrder.model'
import crud from 'src/modules/qcrud/_services/baseService'

export default async function getAdhocSchedules(refresh = false, page = 1, date): Promise<WorkOrders> {
    try {
        const params = {
            refresh,
            params: {
                take: 15,
                page,
                filter: {
                    ...filtersStore.payload,
                    scheduleDateLocal: { ...date },
                },
            },
        };
        return crud.index(
            "apiRoutes.qramp.adhocSchedules",
            params,
        );
    } catch (error) {
        console.log(error);
        return {
            ...dataReturnedWorkOrder
        }
    }
}
