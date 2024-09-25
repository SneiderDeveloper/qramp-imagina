<template>
  <div :class="{
    'lg:tw-flex-wrap lg:tw-space-x-0 xl:tw-flex xl:tw-space-x-2' : inlineMode,
    'tw-mb-1': !inlineMode
  }">
    <template v-for="(field, keyField) in fields.form" :key="keyField">
      <dynamic-field
        v-if="keyField !== 'sta' && keyField !== 'outboundScheduledDeparture'"
        v-show="field.props?.vIf !== false"
        :field="field"
        v-model="form[keyField]"
        @update:modelValue="zanetizeData(keyField)"
        :class="{
         'tw-hidden': keyField === 'stationId',
         'xl:tw-w-fit' : inlineMode }"
      />
      <dynamic-field
        v-if="isbound.inbound && keyField === 'sta'"
        :field="field"
        v-model="form[keyField]"
        @update:modelValue="zanetizeData(keyField)"
        :class="{ 'tw-hidden': keyField === 'stationId' }"
      />
      <dynamic-field
          v-if="isbound.outbound && keyField === 'outboundScheduledDeparture'"
          :field="field"
          v-model="form[keyField]"
          @update:modelValue="zanetizeData(keyField)"
          :class="{ 'tw-hidden': keyField === 'stationId' }"
        />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useModalSchedule from '../uses/useModalSchedule'

export default defineComponent({
  props:{
    inlineMode: {
      type: Boolean,
      default: false,
    }
  },
  setup (props, {emit}) {
    return {...useModalSchedule(props, emit)}
  }
})
</script>

<style scoped>

</style>
