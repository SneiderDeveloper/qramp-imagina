import qRampStore from 'src/modules/qramp/_store/qRampStore';
import {
    BUSINESS_UNIT_LABOR,
    FLIGHT,
    LABOR, NON_FLIGHT, 
    OPERATION_TYPE_NON_FLIGHT,
} from '../../model/constants.js';
import modalScheduleStore from '../store/modalSchedule.store'
import { WorkOrders } from '../contracts/getWorkOrder.contract.js';
import dataReturnedWorkOrderModel from '../models/dataReturnedWorkOrder.model';
import saveWorkOrderOffline from './saveWorkOrderOffline';
import storeKanban from '../store/kanban.store';
import crud from 'src/modules/qcrud/_services/baseService'
import { i18n } from 'src/plugins/utils'

export default async function saveSimpleWorkOrders(): Promise<WorkOrders> {
    try {
        const API_ROUTE = 'apiRoutes.qramp.simpleWorkOrders'
        const CACHE_PATH = 'apiRoutes.qramp.workOrders'
        const modeOffline = !navigator.onLine
        let response = { ...dataReturnedWorkOrderModel }

        const offlineId = new Date().valueOf();
        const form = { ...modalScheduleStore.form };
        let type: any = qRampStore().getTypeWorkOrder();
        let businessUnitId: any = qRampStore().getBusinessUnitId();

        if(qRampStore().getTypeWorkOrder() === LABOR) {
          type = LABOR
        }
        if(OPERATION_TYPE_NON_FLIGHT.includes(Number(form.operationTypeId)) && qRampStore().getTypeWorkOrder() !== LABOR) {
          type = OPERATION_TYPE_NON_FLIGHT.includes(Number(form.operationTypeId)) ? NON_FLIGHT : FLIGHT
        }

        try {
          response = await crud.create(
            API_ROUTE,
            {
              ...form,
              offlineId: storeKanban.isAppOffline ? offlineId: null,
              titleOffline: i18n.tr('ifly.cms.form.newWorkOrder'),
              businessUnitId,
              type,
              ...(modeOffline ? { apiRoute: CACHE_PATH, } : {})
            }
          );
        } catch (err) {
          console.log(err)
        }
        modalScheduleStore.form.offlineId = offlineId

        response = await saveWorkOrderOffline(response);

        return response;
      } catch (error) {
        console.error(error);
        return {
          ...dataReturnedWorkOrderModel
        }
      }
}
