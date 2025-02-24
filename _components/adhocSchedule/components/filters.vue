<template>
  <q-drawer
    v-model="showModal"
    overlay
    side="right"
    bordered
    :width="300"
    :breakpoint="500"
    class="tw-bg-white"
  >
    <!--Title-->
    <div class="
      row
      justify-between
      items-center
      q-pa-md
      tw-fixed
      tw-bg-white
      tw-z-30
      tw-w-72"
    >
      <div class="text-subtitle1 row items-center">
        <q-icon
          name="fa-regular fa-filter"
          color="primary"
          size="20px"
          class="q-mr-sm"
        />
        <label class="
          text-primary
          text-weight-bold"
        >
          {{ i18n.trp('isite.cms.label.filter', {capitalize: true}) }}
        </label>
        </div>
        <!-- Close icon -->
        <q-icon
          name="fa-light fa-xmark"
          color="blue-grey"
          size="20px"
          class="cursor-pointer"
          @click="showModal = false"
        />
    </div>
    <!--tabs-->
    <div class="tw-mb-12 tw-mt-16">
      <div class="text-center tw-px-4">
      <q-btn-toggle
        v-model="scheduleType"
        rounded
        no-caps
        unelevated
        spread
        toggle-color="primary"
        color="grey-2"
        text-color="primary"
        :options="scheduleTypeOptions"
        id="btnCalendarType"
        size="14px"
        padding="sm sm"
      />
      </div>
      <!--calendar-->
      <div class="text-center tw-p-4">
        <q-date class="text-primary shadow-4 custom_q_date"
          v-model="selectedDate"
          color="primary"
          minimal
          bordered
          today-btn
        />
      </div>
      <div class="tw-px-4 text-primary">
        <div v-for="(field, keyField) in filters" :key="keyField" >
          <dynamic-field v-model="form[keyField]" :field="field" />
        </div>
      </div>
    </div>
    <!--footer -->
    <div class="
      text-center
      bg-white
      tw-p-3
      tw-absolute
      tw-bottom-0
      w-97"
      ref="footerContent"
    >
      <q-btn
        :label="i18n.tr('isite.cms.label.search')"
        unelevated
        color="primary"
        no-caps class="tw-w-full"
        rounded
        @click="callBuildKanbanStructure"/>
    </div>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent} from "vue";
import useFilters from '../uses/useFilters'
export default defineComponent({
  components: {},
  props: {},
  setup() {
    return {...useFilters()};
  }
});
</script>
<style scoped>
.q-date {
  min-width: 200px !important;
}
.w-97 {
  width: 97%;
}
</style>

