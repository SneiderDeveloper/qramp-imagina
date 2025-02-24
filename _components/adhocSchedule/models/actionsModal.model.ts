import { computed, ComputedRef } from 'vue';
import store from '../store/filters.store'
import {
	ModelActionsModalResult,
	Action,
} from '../contracts/modelActionsModal.contract';
import { i18n } from 'src/plugins/utils'

export default function modelActionsModal(): ModelActionsModalResult {
	const actions: ComputedRef<Action[]> = computed(() => ([
		{
			props: {
				loading: store.loading,
				color: 'primary',
				label: i18n.tr('isite.cms.label.search'),
			},
			action: () => {
				// add action
			}
		},
	]));

	return {
		actions
	}
}
