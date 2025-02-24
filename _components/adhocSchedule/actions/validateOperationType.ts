import { computed, ComputedRef } from 'vue';
import workOrderList from '../../../_store/actions/workOrderList'

const isbound: ComputedRef<(operationTypeId: any) => { inbound: boolean; outbound: boolean }> =
  computed(() => {
    return operationTypeId => {
      if (operationTypeId) {
        const operationType = workOrderList()
          .getOperationTypeList()
          .find((item) => item.id === Number(operationTypeId));
        const type = operationType?.options?.type;
        if (type) {
          if (type === "full") {
            return { inbound: true, outbound: true };
          }
          if (type === "inbound") {
            return { inbound: true, outbound: false };
          }
          if (type === "outbound") {
            return { inbound: false, outbound: true };
          }
        }
      }
      return { inbound: false, outbound: false };
    }
  });
export default isbound.value;