import { reactive } from 'vue';
import baseService from '@imagina/qcrud/_services/baseService.js'
import qRampStore from '../qRampStore.js'
import { COMPANY_PASSENGER, COMPANY_RAMP } from '../../_components/model/constants.js';

export interface Options {
    type: string;
}

export interface OperationType {
    operationName: string;
    companyId: number;
    company?: any;
    id: number;
    createdAt?: any;
    updatedAt?: any;
    deletedAt?: any;
    restoredAt?: any;
    createdBy?: any;
    updatedBy?: any;
    deletedBy?: any;
    restoredBy?: any;
    externalId?: any;
    options: Options;
    isReportable: boolean;
    forceDelete: boolean;
    defaultInclude: string;
    searchableFields: string;
    fileFormats?: any;
    label: string,
    value: string | number;
}

export interface State {
    operationTypeList: OperationType[];
}

export interface WorkOrderList {
    setOperationTypeList: (data: OperationType[]) => void;
    getOperationTypeList: () => OperationType[];
    getOperationType: () => Promise<OperationType[]>;
}

const state = reactive<State>({
    operationTypeList: [],
});


export default function workOrderList(): WorkOrderList {
    function setOperationTypeList(data: OperationType[]): void {
        state.operationTypeList = data;
    }
    function getOperationTypeList(): OperationType[] {
        return state.operationTypeList;
    }
    // actions 
    async function getOperationType(): Promise<OperationType[]> {
        const isPassenger = qRampStore().getIsPassenger();
        const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
        const params = {
            params: {
                filter: {
                    companyId,
                }
            },
        }
        const response = await baseService.index('apiRoutes.qramp.operationTypes', params);
        const data = response.data.map(item => ({ label: item.operationName, ...item, value: item.id }))
        setOperationTypeList(data);
        return data;
    }
    return {
        setOperationTypeList,
        getOperationTypeList,
        getOperationType,
    }
}