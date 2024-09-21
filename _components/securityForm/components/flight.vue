<template>
  <q-form ref="refFlight">
    <table-flight
      @cancel="dialogTable = $event"
      :dialog="dialogTable"
      :dataTable="dataTable"
      @flightSelect="setDataTable($event)"
    />
    <div class="tw-mt-6 tw-mb-20 row q-col-gutter-lg">
        <div class="col-12 col-md-6">
            <customer v-if="validateComponentCustomerOffline" :dataForm="form" :readonly="disabledReadonly"/>
            <div v-for="(field, keyField) in formFields.flyFormLeft" :key="keyField">
                <dynamic-field
                    :key="keyField"
                    :id="keyField"
                    :field="field"
                    @update:modelValue="handleChange(keyField, $event)"
                    v-model="form[keyField]"
                />
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div v-for="(field, keyField) in formFields.flyFormRight" :key="keyField">
                <dynamic-field
                    :key="keyField"
                    :id="keyField"
                    :field="field"
                    @update:modelValue="handleChange(keyField, $event)"
                    v-model="form[keyField]"
                />
            </div>
        </div>
      <div class="col-12 col-md-6" v-if="isActualInAndActualOut">
        <collapseFly
          :title="$tr('isite.cms.label.inbound')"
          :flightNumber="form.inboundFlightNumber"
          :isComplete="validateBoundComplete('inboundLeft')"
        >
          <div v-for="(field, keyField) in formFields.inboundLeft" class="tw-px-4">
            <div>
              <dynamic-field
                :key="keyField" :id="keyField" :field="field"
                v-model="form[keyField]"  :ref="`${keyField}`"
                @enter="searchFlightaware(keyField)"
              />
            </div>
          </div>
        </collapseFly>
      </div>

      <div class="col-12 col-md-6" v-if="isActualInAndActualOut">
        <div>
          <collapseFly :title="$tr('isite.cms.label.outbound')" :flightNumber="form.outboundFlightNumber"
                       :isComplete="validateBoundComplete('outboundRight')">
            <div v-for="(field, keyField) in formFields.outboundRight" class="tw-px-4">
              <div>
                <dynamic-field
                  :key="keyField"
                  :id="keyField"
                  :field="field"
                  v-model="form[keyField]"
                  @enter="searchFlightaware(keyField)"
                />
              </div>
            </div>
          </collapseFly>
        </div>
      </div>
      <div
        class="col-12"
        v-if="isActualInAndActualOut"
      >
        <div class="tw-font-semibold
          lg:tw-grid
          lg:tw-grid-cols-2
          md:tw-grid-cols-2
          tw-gap-5
          tw-border
          tw-border-gray-200
          tw-p-2
          tw-rounded-md">
          <div v-for="(field, keyField) in formFields.dateBound" :key="keyField">
            <div>
              <dynamic-field
                :key="keyField"
                :id="keyField"
                :field="field"
                v-model="form[keyField]"
              />
            </div>
          </div>
          <div class="
              tw-col-span-2
              tw-p-4
              tw-border
              tw-border-gray-200
              tw-mx-4
              tw-text-center">
            Difference (hours): {{ differenceHour }}
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import customer from '../../customer/index.vue'
import flightController from '../controllers/flight'
import storeFueling from "../store";
import collapseFly from './collapse.vue'
import collapse from "../../flight/collapse.vue";
import tableFlight from "../../modal/tableFlight.vue";

export default defineComponent({

  computed: {
    storeFueling() {
      return storeFueling
    }
  },
    components:{
      tableFlight,
      collapse,
        customer,
      collapseFly
    },
    setup () {
        return {...flightController()}
    }
})
</script>

<style scoped>

</style>
