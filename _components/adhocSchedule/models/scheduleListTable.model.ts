import { i18n } from 'src/plugins/utils'
import { Column } from '../contracts/scheduleHistoryTable.contract'

export const status = {
	1: {
		label: i18n.tr('isite.cms.label.pending'),
		icon: {
			name: 'fa-solid fa-clock',
			color: 'tw-text-orange-400'
		},
	},
	2: {
		label: i18n.tr('isite.cms.message.inProgress'),
		icon: {
			name: 'fa-duotone fa-spinner-third fa-spin',
			color: 'tw-text-blue-400'
		}
	},
	3: {
		label: i18n.tr('isite.cms.message.failed'),
		icon: {
			name: 'fa-solid fa-circle-exclamation',
			color: 'tw-text-red-400'
		}
	},
	4: {
		label: i18n.tr('isite.cms.label.success'),
		icon: {
			name: 'fa-solid fa-circle-check',
			color: 'tw-text-green-400'
		}
	}
}

export const columns: Column[] = [
	{
		name: 'airport',
		required: true,
		label: 'Airport',
		align: 'left',
		field: 'airport',
		format: val => `${val.airportName} (${val.airportCode})`,
		sortable: true
	},
	{ 
		name: 'airline', 
		align: 'left', 
		label: 'Airline', 
		field: 'airline', 
		sortable: true,
		format: val => `${val.airlineName} (${val.airlineCode})`, 
	},
	{ name: 'startDate', label: 'Start date', field: 'startDate', align: 'left', sortable: true },
	{ name: 'dateRange', label: 'Date range', field: 'dateRange', align: 'left'},
	{ 
		name: 'status', 
		label: i18n.trp('isite.cms.label.state'), 
		align: 'left', 
		field: 'status', 
		format: (val) => status[val]?.label,
		style: 'width: 60px'
	},
	{ 
		name: 'icon', 
		label: '', 
		align: 'center', 
		field: 'status',
		format: (val) => status[val]?.icon,
		style: 'padding-left: 0; width: 10px' 
	},
	{ name: 'open', label: 'Open', field: 'open', align: 'center' },
]

export const initialPagination = {
	sortBy: 'id',
	descending: true,
	rowsPerPage: 5,
}