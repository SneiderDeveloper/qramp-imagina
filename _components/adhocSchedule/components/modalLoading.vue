<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { eventBus } from 'src/plugins/utils'
import store from '../store/filters.store.ts'

const message = ref('Processing')

onMounted(() => {
    const previousRuleId = Number(store.adhocRuleId)

    eventBus.on('adHocScheduleLogMessage', async (data) => {
        const adhocRuleId = Number(store.adhocRuleId)
        const ruleId = Number(data?.ruleId)

        if (!adhocRuleId) {
            store.adhocRuleId = data?.ruleId
        }

        if (previousRuleId !== ruleId) {
            store.adhocRuleId = data?.ruleId
        }

        if (((adhocRuleId === ruleId) && (previousRuleId !== ruleId)) || !adhocRuleId) {
            message.value = data.message
        }
    })
})

onBeforeUnmount(() => {
    eventBus.off('adHocScheduleLogMessage')
})

</script>
<template>
    <section class="tw-flex tw-flex-col tw-gap-5 tw-text-center tw-justify-center">
        <i class="fa-regular fa-buildings tw-text-5xl"></i>
        <section>
            <p class="tw-text-gray-400 tw-mb-2">This may take several minutes</p>
            <q-linear-progress rounded size="7px" indeterminate color="secondary" />
        </section>
        <section>
            <span class="tw-text-gray-500 tw-ml-2">{{ message }}</span>
        </section>
        <h1 class="tw-text-base">
            We are building the schedule for you. Please do not close
            this window until the process it's completed, otherwise,
            you might end up with an uncompleted schedule.
        </h1>
    </section>
</template>
