import { ref, onMounted, nextTick } from 'vue'
import storeFilter from '../store/filters.store'
import { columns, initialPagination, status } from '../models/scheduleListTable.model'
import baseService from 'src/modules/qcrud/_services/baseService'
import storeKanban from '../store/kanban.store';
import buildKanbanStructure from '../actions/buildKanbanStructure';
import setUrlParams from '../actions/setUrlParams';
import getTitleFilter from '../actions/getTitleFilter';
import { alert } from 'src/plugins/utils'
import moment from 'moment'

export default function useScheduleListTable(props: any, emit: any) {
	const rows = ref([])
	const loading = ref(true)
	const pagination = ref({
		...initialPagination,
		...props.initialPagination
	})
	const API_ROUTE = 'apiRoutes.qramp.adHocScheduleRules'
	const STATUS_SUCCESS = 4

	const openSchedule = async (row) => {
		if (row.status === STATUS_SUCCESS) {
			storeFilter.adhocRuleId = row.id;
			storeKanban.scheduleRule = {
				airline: {
					airlineShortName: row.airline?.airlineShortName,
				},
				airport: {
					airportIataCode: row.airport?.airportIataCode,
				},
			};
			storeFilter.showModalSchedule = false;
			storeKanban.showModalHistory = false;
			storeFilter.selectedDate = moment(row.startDate, 'YYYY-MM-DDTHH:mm:ss').format('YYYY/MM/DD');
			getTitleFilter();
			await setUrlParams();
			await buildKanbanStructure();
		} else {
			alert.warning({
				message: 'This rule has no preview available',
			})
		}
	}

	const getScheduleHistory = async () => {
		return await baseService.get(API_ROUTE, {
			include: 'airport,airline',
			filter: {
				order:{
					field:'id',
					way:'desc'
				}
			}
		})
	}

	const onHandleClickCreate = () => {
		emit('onEmptyTableButtonClick')
	}

	const init = async () => {
		try {
			loading.value = true
			const response = await getScheduleHistory()

			if (!response.data || response.data.length === 0) {
				storeFilter.selectedTab = 2
			}

			const data = response.data
			data.map(item => {
				item.icon = status[item.status].icon;
			})

			rows.value = data
		} catch (error) {
			console.error(error)
		} finally {
			loading.value = false
		}
	}

	onMounted(async () => {
		await nextTick(async () => {
			setTimeout(async () => {
				await init()
			}, 500)
		})
	})

	return {
		columns,
		rows,
		pagination,
		openSchedule,
		loading,
		onHandleClickCreate,
	}
}
