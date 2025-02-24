<template>
    <master-modal
      v-model="showModalSchedule"
      :title="title"
      :persistent="true"
      :actions="actions"
      :maximized="$q.screen.lt.md"
      width="600px"
      @hide="handleCloseModal"
    >
      <div class="tw-h-[354px]">
        <div v-if="!loading" class="tw-border tw-border-gray-200 tw-rounded-xl tw-p-1 tw-mb-4">
          <q-btn-toggle
            rounded
            unelevated
            :modelValue="selectedTab"
            @update:modelValue="handleChangesTab"
            toggle-color="grey-3"
            toggle-text-color="black"
            text-color="grey-8"
            size="14px"
            class="btn-toggle-element-content"
            :options="tapOptions"
            no-caps
            spread
            dense
          />
        </div>
        <section v-if="!loading" class="tw-h-4/5">
          <q-form v-if="isCreate" ref="refModalStation">
            <dynamic-field
              v-for="(field, key) in fields"
              :field="field"
              v-model="scheduleForm[key]"
            />
          </q-form>
          <scheduleListTable
            v-if="!isCreate"
            :hideBottom="true"
            @onEmptyTableButtonClick="handleChangesTab(CREATE)"
          />
        </section>
        <modalLoading v-if="loading" class="tw-h-full"/>
      </div>
    </master-modal>
  </template>
<script lang="ts">
import { defineComponent } from "vue";
import useModalScheduleAdhoc from '../uses/useModalScheduleAdhoc'
import scheduleListTable from '../components/scheduleListTable.vue'
import modalLoading from "./modalLoading.vue";

export default defineComponent({
  components: {
    scheduleListTable,
    modalLoading
  },
  setup() {
    return {...useModalScheduleAdhoc()}
  }
})
</script>
<style scoped>
.btn-toggle-element-content > button {
  @apply tw-w-auto sm:tw-w-60 !important;
}

.btn-toggle-element-content > button > span:nth-child(2) > span {
  display: grid;
  grid-template-columns: 1fr auto;
}

.btn-toggle-element-content ::v-deep button:hover:not(.text-black) {
  @apply tw-text-gray-400 !important;
}

.btn-toggle-element-content ::v-deep button:hover > .q-focus-helper {
  @apply tw-bg-transparent !important;
}

.btn-toggle-element-content ::v-deep button {
  border-top-left-radius: 10px !important;
  border-bottom-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}
</style>
