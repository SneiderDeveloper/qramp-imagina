<script lang="ts">
import { defineComponent } from 'vue';
import useScheduleListTable from '../uses/useScheduleListTable.ts'
import noData from 'src/modules/qsite/_components/master/dashboardRenderer/components/noData.vue';

export default defineComponent({
	props: {
		initialPagination: Object,
		hideBottom: Boolean,
	},
	components: {
		noData,
	},
	emits: ['onEmptyTableButtonClick'],
	setup(props, { emit }) {
		return {...useScheduleListTable(props, emit)}
  	}
})
</script>
<template>
	<q-table
		v-if="rows.length > 0 || loading" 
		class="schedule-list-table"
		card-class="tw-rounded-xl"
		:rows="rows"
		:columns="columns"
		row-key="id"
		flat
		virtual-scroll
		:pagination="pagination"
		:hide-bottom="hideBottom"
		:loading="loading"
	>
		<template v-slot:header="props">
			<q-tr 
				:props="props" 
				class="tw-bg-gray-100"
			>
				<q-th
					v-for="col in props.cols"
					:key="col.name"
					:props="props"
				>
					<b class="tw-text-gray-500 tw-text-sm tw-mr-4">
						{{ col.label }}
					</b>
				</q-th>
			</q-tr>
		</template>
		<template v-slot:body-cell-open="props">
			<q-td :props="props">
				<q-btn
					dense
					flat
					class="
						tw-text-gray-500 
						hover:tw-text-green-500
					"
					@click="openSchedule(props.row)"
				>
					<i class="fa-regular fa-eye" />
				</q-btn>
			</q-td>
		</template>
        <template v-slot:body-cell-icon="props">
            <td class="bg-white" :props="props.row">
                <q-icon 
                    :name="props.row?.icon?.name"
                    :class="props.row?.icon?.color"
                    size="16px"
                />
            </td>
        </template>
		<template v-if="loading" v-slot:loading="props">
			<section class="tw-flex tw-flex-col tw-gap-2 tw-mt-2">
				<q-skeleton 
					v-for="page in pagination?.rowsPerPage" 
					type="QChip" 
					class="tw-w-full tw-h-10"
				/>
			</section>
		</template>
	</q-table>
	<section 
		v-if="(rows.length === 0) && !loading" 
		class="tw-w-full tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center"
	>
		<div class="tw-flex tw-flex-col tw-justify-center tw-items-center">
			<i class="fa-solid fa-folder-open tw-text-7xl tw-text-gray-300"></i>
			<h4 class="tw-text-base tw-font-bold tw-mt-4 tw-text-gray-500">
				There are no schedules created
			</h4>
			<p class="tw-text-gray-500 tw-text-center tw-mt-2 tw-text-sm">
				Click on the button below to create a new schedule
			</p>
			<q-btn
				rounded
				unelevated
				no-caps
				color="secondary"
				class="tw-mt-4"
				label="Create schedule"
				@click="onHandleClickCreate"
			/>
		</div>
	</section>
</template>
<style lang="scss">
.schedule-list-table {
	th:nth-child(5), td:nth-child(5) {
		position: sticky;
		right: 20px;
		z-index: 1;
	}
	
	th:last-child, td:last-child {
		position: sticky;
		right: 0;
		z-index: 2;
	}

	td:last-child {
		background-color: white;
	}

	.q-table th,
	.q-table td {
		border-color: $grey-2;
	}
}
</style>