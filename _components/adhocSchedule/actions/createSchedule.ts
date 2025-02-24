import store from '../store/filters.store'
import storeKanban from '../store/kanban.store'
import { cache } from 'src/plugins/utils';
import baseService from 'src/modules/qcrud/_services/baseService'

export const createSchedule = async (refModalStation) => {
	try {
		refModalStation.validate().then(async (success) => {
			if (success) {
				store.loading = true;
				store.titleModal = 'Building schedule'
				Object.keys(store.scheduleForm).forEach(async key => {
					await cache.set(key, store.scheduleForm[key])
				});
				store.selectedDate = store.scheduleForm.startDate
				storeKanban.scheduleType = store.scheduleType

				const response = await baseService.create('apiRoutes.qramp.adHocScheduleRules', store.scheduleForm)
				store.reset()
				store.adhocRuleId = response.data.id
			}
		});
	} catch (error) {
		console.error(error);
		store.showModalSchedule = false;
		storeKanban.showModalCreateSchedule = false;
	} finally {
		store.loading = false
	}
}
