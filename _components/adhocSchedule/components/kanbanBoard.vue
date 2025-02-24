<template>
  <div class="kanbanBoardCtn">
    <page-actions
      ref="refPageActions"
      :title="title"
      multipleRefresh
      :extra-actions="extraPageActions"
      class="q-mb-md"
      @search="val => changeSearch(val)"
      @refresh="buildKanbanStructure(true)"
    />
    <div class="tw-flex tw-gap-4">
      <template v-for="summary in scheduleRule">
        <div
          v-if="summary.value"
          class="
            tw-flex
            tw-flex-col
            tw-rounded-xl
            tw-p-4
            tw-shadow-lg
            tw-mb-3
          "
        >
          <p class="tw-text-xl tw-font-bold">{{ summary.value }}</p>
          <span class="tw-text-gray-400 tw-text-xs">{{ summary.label }}</span>
        </div>
      </template>
    </div>
    <filters v-if="storeFilter.showModal"/>
    <actionBar />
    <div class="tw-flex">
      <div
        class="
          tw-flex-none
          tw-py-4
          tw-border-b
          tw-border-gray-200
          tw-space-y-4 tw-hidden
        "
      >
        <q-btn-toggle
          v-model="scheduleType"
          rounded
          no-caps
          unelevated
          toggle-color="blue-grey"
          color="grey-2"
          text-color="blue-grey"
          :options="scheduleTypeOptions"
          id="btnCalendarType"
          size="14px"
          spread
          class="tw-py-2"
        />
        <q-date v-model="selectedDate" minimal size="sm"/>
        <dynamic-field v-model="filterTime" :field="dynamicFieldTime" />
      </div>
      <div
        v-if="columns.length > 0"
        class="
          tw-flex-1
          tw-h-auto
          tw-flex
          tw-overflow-x-auto
        "
      >
        <kanbanColumn
          v-for="(column, index) in columns"
          :key="index"
          :column="column"
          :groupOptions="groupOptions"
          class="
            tw-flex-none
            tw-space-y-0
            tw-h-auto
            tw-rounded-lg
            tw-mb-4
          "
        />
      </div>
    </div>
    <modalHistory />
    <modalCreateSchedule />
    <modalScheduleAdhoc />
    <flightDetail />
    <inner-loading :visible="loadingMain"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import kanbanColumn from './kanbanColumn.vue';
import useKanbanBoard from '../uses/useKanbanBoard'
import actionBar from './actionBar.vue'
import filters from './filters.vue';
import modalScheduleAdhoc from './modalScheduleAdhoc.vue';
import flightDetail from '../../modal/flightDetail.vue';
import modalHistory from '../components/modalHistory.vue';
import modalCreateSchedule from '../components/modalCreateSchedule.vue';

export default defineComponent({
  components: {
    kanbanColumn,
    actionBar,
    filters,
    modalScheduleAdhoc,
    flightDetail,
    modalHistory,
    modalCreateSchedule,
  },
  setup(props) {
    return {...useKanbanBoard(props)}
  },
});
</script>

<style>
.kanbanBoardCtn {
  font-family: 'Manrope', sans-serif;
}
</style>
