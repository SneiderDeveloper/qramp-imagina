<template>
  <div
    class="tw-relative  columnCtn q-col tw-w-full"
    :class="{'columnCtnFull' : !isWeekAgenda }"
  >
    <div
      ref="refKanbanColumn"
      class="tw-py-3"
      :class="`cardCtn-${date}`"
      @dragover.prevent="setDrag(true)"
      @drop.prevent="setDrag(false)"
    >
      <div
       class="
        tw-border-b-2
        tw-border-gray-200
        tw-pb-1
        tw-text-sm"
      >
        <div class="tw-flex tw-items-center tw-space-x-2 tw-justify-center">
          <p class="q-mb-md tw-font-semibold text-column tw-uppercase">
            {{ date.format("dddd") }}
          </p>
          <button
            class="
             tw-rounded-full
             tw-w-7
             tw-h-7
             tw--mt-4
             tw-text-slate-500
             dayGray"
            :class="{
              'buttom-day': selectedDate === date.format('YYYY/MM/DD'),
              'tw-border tw-border-blue-500': moment().format('YYYY/MM/DD') === date.format('YYYY/MM/DD')
            }"
            @click="showKanbanDay"
          >
            <span class="tw-font-semibold">
              {{ date.format("D") }}
            </span>
          </button>
        </div>
      </div>
      <completed-schedule
       :column="column"
       @refresh="singleRefreshment"
       :isWeekAgenda = "isWeekAgenda"
      />
      <div
        v-if="column.loading"
        class="
         tw-flex
         tw-justify-center
         tw-absolute
         tw-inset-0
         tw-pt-48
         tw-bg-white
         tw-bg-opacity-75
         tw-z-20"
      >
        <q-spinner color="primary" size="2em" />
      </div>
      <div
        class="h-200 bg-blue-gray-1000 tw-px-2 tw-pt-4"
        :class="{
          'tw-border tw-border-gray-300 ': column.isDrag,
          'h-201-black': isBlank
        }"
      >
        <div
          v-if="column.isDrag"
          ref="refTrigger"
          class="
           tw-flex
           tw-absolute
           tw-justify-center
           tw-inset-0
           tw-mt-80"
        >
            <i class="fa-thin fa-cards-blank tw-text-7xl tw-text-gray-300" />
        </div>
        <draggable
          :id="date.format('YYYY-MM-DD')"
          v-model="cards"
          :animation="200"
          group="cards"
          ghost-class="ghostCard"
          drag-class="dragCard"
          filter=".ignoreItem"
          class="scrollbar tw-overflow-y-auto tw-overflow-x-hidden tw-mb-4 tw-h-full tw-px-2"
          handle=".dot-vertical"
          @end="changeDate"
          :disabled="true"
          item-key="id"
        >
          <template #item="{ element }">
            <div :id="element?.id" :key="element?.id">
              <component
                :is="element?.editable ? 'inlineSchedule': cardComponentName"
                :isWeekAgenda="isWeekAgenda"
                :card="element"
                :dateColumn="column.date.format('YYYY-MM-DD')"
                :class="{ hidden: column?.isDrag  }"
              />
            </div>
          </template>
          <template #footer>
            <div
              ref="refTrigger"
              v-show="!column.isDrag"
              class="tw-text-center tw-h-5 tw-flex tw-justify-center"
              :class="`trigger-${date}`"
            >
              <q-spinner v-if="isLoading" color="primary" size="1.3em" />
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import draggable from "vuedraggable";
import kanbanCard from "./kanbanCard.vue";
import useKanbanColumn from "../uses/useKanbanColumn";
import completedSchedule from './completedSchedule.vue';
import kanbanDay from "./kanbanDay.vue";

export default defineComponent({
  components: {
    draggable,
    kanbanCard,
    completedSchedule,
    kanbanDay,
  },
  props: {
    column: {
      type: Object,
      required: true,
    },
    groupOptions: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    return {
      ...useKanbanColumn(props),
    };
  },
});
</script>

<style>
.columnCtn {
  width: 13.6vw;
}
.columnCtnFull {
  width: 100% !important;
}
.columnCtn .text-column {
  color: #8A98C3;
  leading-trim: both;
  text-edge: cap;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 142%; /* 19.88px */
  letter-spacing: 0.07px;
}
.bg-blue-gray-1000 {
  background: #F3F5FB;
}
.dayGray {
  background: #F1F4FA
}
.dragCard {
  @apply tw-bg-white tw-opacity-100;
  cursor: grabbing;
}

.ghostCard {
  @apply tw-opacity-50 tw-bg-gray-100;
}

.columnCtn .h-200 {
  height: 70vh;
}

.columnCtn .h-201-black {
  height: 68vh;
}

.columnCtn .scrollbar::-webkit-scrollbar-track {
  @apply tw-bg-gray-100 !important;
}

.columnCtn .scrollbar::-webkit-scrollbar-thumb {
  @apply tw-bg-gray-100 !important;
}

.columnCtn .scrollbar:hover::-webkit-scrollbar-thumb {
  @apply tw-bg-gray-300 !important;
}

.columnCtn .text-blue-gray-rb-5 {
  color: rgba(138, 152, 195, 1);
}

.columnCtn .buttom-day {
  @apply tw-bg-blue-800 tw-text-white !important;
}

@media (max-width: 1600px) {
  .columnCtn {
    width: 260px;
  }
}
</style>
