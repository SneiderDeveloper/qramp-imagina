<template>
    <div>
        <div
            v-if="['day-agenda', 'week-agenda'].includes(scheduleType)"
            :class="{
                'h-43': cards.length === 0,
            }"
            class="
              tw-inline-flex
              tw-items-center
              tw-w-full
              tw-px-4
              tw-py-2
              tw-mt-1
              tw-text-xs
              lg:tw-text-base
              tw-leading-none
              tw-bg-white
              tw-rounded-lg
              tw-label-not
              tw-h-12"
        >
            <div
                class="tw-absolute tw-right-5"
                :class="{
                    'tw-mt-1': cards.length === 0
                }"
            >
            <div class="
                tw-inline-flex
                tw-items-center
                tw-justify-center"
            >
                <q-btn
                    icon="fa-light fa-rotate-right tw-text-blue-500"
                    size="sm"
                    outline
                    unelevated
                    flat
                    dense
                    @click="refresh"
                >
                    <q-tooltip>
                        {{ i18n.trp('isite.cms.label.refresh') }}
                    </q-tooltip>
                </q-btn>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useCompletedSchedule from '../uses/useCompletedSchedule'

export default defineComponent({
    props: {
        scheduleType: {
            type: String,
            default: () => 'week-agenda'
        },
        isWeekAgenda: {
            type: Boolean,
            default: true
        },
        column: {
            type: Object,
            default: () => {}
        }
    },
    setup(props, {emit}) {
        return {
            ...useCompletedSchedule(props, emit)
        }
    }
})
</script>

<style>
.h-43 {
  height: 43px !important;
}

.btn-dropdown-plus > span:nth-child(2) > i:nth-child(2) {
    display: none;
}
</style>