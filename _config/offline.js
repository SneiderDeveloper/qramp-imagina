import workOrderList from '../_store/actions/workOrderList.ts';
import cache from "modules/qsite/_plugins/cache";


export default async function (refresh = false) {
  await workOrderList().getAllList(refresh);
}
