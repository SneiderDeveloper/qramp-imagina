<template>
  <div id="formFlyStep" class="tw-mt-6 tw-mb-20">
    <q-form @submit.prevent.stop="saveInfo" ref="myForm" id="rowContainer" class="row q-col-gutter-lg">
      <table-flight @cancel="dialog = $event" :dialog="dialog" :dataTable="dataTable"
        @flightSelect="setDataTable($event)" @validateBound="validateBound(flightNumberField)" />
      <div class="col-12 col-md-6">
        <div v-for="(field, keyField) in formFields.flyFormLeft">
          <label v-if="keyField == 'customerId'"
            :class="`${readonly ? `${responsive ? 'no-wrap' : 'justify-end'} row items-center` : ''}`">
            <dynamic-field v-if="bannerMessage" class="q-mb-md" :field="formFields.banner" />
            <dynamic-field :key="keyField" :id="keyField" :field="field" :class="`${readonly ? 'col-7' : ''}`"
              :style="`${field.type !== 'input' && !readonly ? 'padding-bottom:7px' : 'padding-bottom:0px'}`"
              v-model="selectCustomers" @update:modelValue="setCustomerForm" @filter="setCustomerName" ref="customerId">
              <template #before-options>
                <div class="q-py-md q-px-md" @click="addCustumers">
                  <div class="row cursor-pointer">
                    <div class="q-pr-md">
                      <q-btn push color="primary" round icon="fas fa-plus" size="xs" />
                    </div>
                    <div class="q-py-xs">
                      <label class="cursor-pointer">{{ $tr('ifly.cms.label.createNewCustomer') }}</label>
                    </div>
                  </div>
                </div>
              </template>
            </dynamic-field>
          </label>
          <label v-if="keyField != 'customerId' && keyField != 'customCustomerName'"
            :class="`${readonly ? `${responsive ? 'no-wrap' : 'justify-end'} row items-center` : ''}`">
            <span v-if="readonly" class="col-5 text-right span q-pr-sm text-primary">{{ field.label }}:</span>
            <dynamic-field :key="keyField" :id="keyField" :field="field" :class="`${readonly ? 'col-7' : ''}`"
              :style="`${field.type !== 'input' && !readonly ? 'padding-bottom:7px' : 'padding-bottom:0px'}`"
              v-model="form[keyField]" @update:modelValue="resetField(keyField)" />
          </label>
          <hr v-if="readonly" class="label-container" />
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div v-for="(field, keyField) in formFields.flyFormRight"
          :style="`${readonly ? 'height: 50px' : 'padding-bottom: 7px'}`">
          <label :class="`${readonly ? `${responsive ? 'no-wrap' : 'justify-end'} row items-center` : ''}`">
            <span v-if="readonly" class="col-5 text-right span q-pr-sm text-primary">{{ field.label }}:</span>
            <dynamic-field v-if="keyField !== 'responsibleId'" :key="keyField" :id="keyField" :field="field"
              :class="`${readonly ? 'col-7' : ''}`"
              :style="`${field.type !== 'input' && !readonly ? 'padding-bottom:1px' : 'padding-bottom:0px'}`"
              v-model="form[keyField]" @update:modelValue="resetField(keyField)" />
          </label>
          <div v-if="keyField === 'responsibleId'">
            <dynamic-field :key="keyField" :id="keyField" :field="field" :class="`${readonly ? 'col-7' : ''}`"
              :style="`${field.type !== 'input' && !readonly ? 'padding-bottom:7px' : 'padding-bottom:0px'}`"
              v-model="form[keyField]" />
          </div>
          <hr v-if="readonly" class="label-container" />
        </div>
      </div>
      <div v-if="isbound[0] && !validateNoFligth" class="col-12 col-md-6">
        <div v-if="isCollapse">
          <collapse :title="$tr('isite.cms.label.inbound')" :flightNumber="form.inboundFlightNumber"
            :isComplete="completeFormInbound">
            <div v-for="(field, keyField) in formFields.inboundLeft" class="tw-px-4">
              <div :class="`${readonly ? `${responsive ? 'no-wrap' : 'justify-end'} row items-center` : ''}`">
                <span v-if="readonly" class="col-5 text-right q-pr-sm text-primary">{{ field.label }}:</span>
                <dynamic-field :key="keyField" :class="`${readonly ? 'col-7' : ''}`" :id="keyField" :field="field"
                  :style="`${field.type !== 'input' && !readonly ? keyField == 'origin' ? '' : 'padding-bottom:8px' : 'padding-bottom:8px'}`"
                  v-model="form[keyField]" @enter="search(field)" :ref="`${keyField}`" @update:modelValue="zanetizeData(keyField)" />
              </div>
            </div>
          </collapse>
        </div>
      </div>
      <div v-if="isbound[1] & !validateNoFligth" class="col-12 col-md-6">
        <div v-if="isCollapse">
          <collapse :title="$tr('isite.cms.label.outbound')" :flightNumber="form.outboundFlightNumber"
            :isComplete="completedFormOutBound">
            <div v-for="(field, keyField) in formFields.outboundRight" class="tw-px-4">
              <div :class="`${readonly ? `${responsive ? 'no-wrap' : 'justify-end'} row items-center` : ''}`">
                <span v-if="readonly" class="col-5 text-right q-pr-sm text-primary">{{ field.label }}:</span>
                <dynamic-field :key="keyField" :class="`${readonly ? 'col-7' : ''}`" :id="keyField" :field="field"
                  :style="`${field.type !== 'input' && !readonly ? keyField == 'destination' ? '' : 'padding-bottom:8px' : 'padding-bottom:8px'}`"
                  v-model="form[keyField]" @enter="search(field)" @update:modelValue="zanetizeData(keyField)" />
              </div>
            </div>
          </collapse>
        </div>
      </div>

      <div
        v-if="isActualInAndActualOut"
        class="col-12"
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
                  :style="`${field.type !== 'input' && !readonly ? keyField == 'origin' ? '' : 'padding-bottom:8px' : 'padding-bottom:8px'}`"
                  v-model="form[keyField]"
                  @update:modelValue="changeDate(field)"
              />
              <div
                class="tw-text-xs tw-px-3 tw--mt-2 tw-text-gray-400"
                v-if="validateDelayMinute(keyField)"
              >
                <p>Delay: {{ differenceTimeMinute[keyField == 'inboundBlockIn' ? 'inbound' : 'outbound'] }} min</p>
              </div>
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
    </q-form>
    <inner-loading :visible="!isCollapse" />
  </div>
</template>
<script>
import responsive from '../../_mixins/responsive.js'
import tableFlight from '../modal/tableFlight.vue'
import qRampStore from '../../_store/qRampStore.js';
import {
  OPERATION_TYPE_OTHER,
  NON_FLIGHT,
  FLIGHT,
  LABOR,
  OPERATION_TYPE_NON_FLIGHT,
  THIRTY_MINUTES,
  OPERATION_TYPE_TURN_PASSENGER,
  FIFTEEN_MINUTES,
  SECURITY
} from '../model/constants.js'
import workOrderList from '../../_store/actions/workOrderList.ts';
import collapse from './collapse.vue'
import moment from 'moment';
import momentTimezone from "moment-timezone";
import serviceListStore from '../serviceList/store/serviceList';
import store from './store'
import { updateFavoriteServicesList } from '../serviceList/actions/updateFavoriteServicesList';
import cargoStore from "src/modules/qramp/_components/cargo/store/cargo";
import flightStore from "src/modules/qramp/_components/flight/store"

export default {
  props: {
    readonly: true,
    toolbar: {},
    dataCompoment: {
      type: Object,
      default: () => { }
    }
  },
  emits: ['isError'],
  components: { tableFlight, collapse },
  mixins: [responsive],
  created() {
    this.$nextTick(function () {
      workOrderList().getOperationType();
    })
  },
  mounted() {
    this.$nextTick(function () {
      document.querySelector('.master-dialog__body')
        .addEventListener('scroll', this.handleScroll);
      this.init();
    })
  },
  data() {
    return {
      form: {
        customCustomer: false,
        adHoc: false,
        operationTypeId: null,
        statusId: null,
        date: '',
        inboundCustomFlightNumber: null,
        outboundCustomFlightNumber: null,
        inboundFlightNumber: null,
        outboundFlightNumber: null,
        inboundOriginAirportId: null,
        outboundDestinationAirportId: null,
        outboundBlockOut: null,
        stationId: null,
        cancellationType: null,
        scheduleDate: '',
      },
      refresh: 1,
      selected: [],
      loadingState: false,
      update: false,
      dialog: false,
      inOutBound: null,
      timeoutID: '',
      dataTable: [],
      mainData: [],
      selectCustomers: '',
      bannerMessage: null,
      customerName: '',
      newCustumerAdHoc: [],
      differenceHour: 0,
      responsibleList: [],
      completeFormInbound: false,
      completedFormOutBound: false,
    }
  },
  watch:{
    dataCompoment: {
      handler() {
        this.init()
      },
      deep: true
    },
    'form.inboundFlightNumber' (val) {
      if (!val) {
        this.form.inboundFlightNumber = null,
          this.form.inboundOriginAirportId = null,
          this.form.inboundTailNumber = null,
          this.form.inboundScheduledArrival = null
      }
    },
    'form.outboundFlightNumber'(val) {
      if (!val) {
        this.form.outboundFlightNumber = null,
          this.form.outboundDestinationAirportId = null,
          this.form.outboundTailNumber = null,
          this.form.outboundScheduledDeparture = null
      }
    },
    'form.operationTypeId'(newVal) {
      if(qRampStore().getTypeWorkOrder() !== LABOR) {
        if(OPERATION_TYPE_NON_FLIGHT.includes(Number(newVal))) {
          qRampStore().setTypeWorkOrder(NON_FLIGHT);
        } else {
          qRampStore().setTypeWorkOrder(FLIGHT);
        }
      }
      this.validateTimeWithField('inboundScheduledArrival', 'inboundScheduledArrival', 'inbound');
      this.validateTimeWithField('outboundScheduledDeparture', 'outboundScheduledDeparture', 'outbound');
      this.setTimeDelayList();
    }
  },
  computed: {
    delayMinute() {
      return OPERATION_TYPE_TURN_PASSENGER == this.form.operationTypeId ? THIRTY_MINUTES : FIFTEEN_MINUTES;
    },
    differenceTimeMinute() {
      return  flightStore().getDifferenceTimeMinute()
    },
    validateDelayMinute() {
      return keyField => {
        const threshold = this.differenceTimeMinute[keyField == 'inboundBlockIn' ? 'inbound' : 'outbound'];
        return this.delayMinute == THIRTY_MINUTES ? threshold >= this.delayMinute : threshold > this.delayMinute;
      }
    },
    validateNoFligth() {
      return qRampStore().getTypeWorkOrder() === NON_FLIGHT;
    },
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    operationTypeList() {
      const data = structuredClone(workOrderList().getOperationTypeList())
      if (OPERATION_TYPE_NON_FLIGHT.includes(Number(this.form.operationTypeId))) return data
      if (this.isPassenger) return data.filter(item => item.id !== OPERATION_TYPE_NON_FLIGHT[0])
      return data
    },
    disabledReadonly() {
      return qRampStore().disabledReadonly();
    },
    isDesktop() {
      return window.innerWidth >= '900';
    },
    flightBoundFormStatus() {
      return qRampStore().getFlightBoundFormStatus();
    },
    flightNumberField() {
      return qRampStore().getFlightNumberField();
    },
    validateFutureDateTime() {
      return (dateTime, min, currentDate) => qRampStore().validateFutureDateTime(dateTime, min, currentDate);
    },
    selectCustomerComputed: {
      get() {
        return this.selectCustomers;
      },
      set(value) {
        this.selectCustomers = value;
      }
    },
    isbound() {
      if (this.form.operationTypeId) {
        const operationType = this.operationTypeList
          .find(item => item.id === Number(this.form.operationTypeId));
        const type = operationType?.options?.type;
        if (type) {
          if (type === 'full') {
            return [true, true];
          }
          if (type === 'inbound') {
            return [true, false]
          }
          if (type === 'outbound') {
            return [false, true];
          }
        }
      }
      return [false, false];
    },
    validateCancellationNoticeTime() {
      return this.form.cancellationType ? true : false;
    },
    readStatus() {
      return !this.$hasAccess('ramp.work-orders.edit-status') || this.readonly || this.disabledReadonly
    },
    manageResponsiblePermissions() {
      return this.$hasAccess('ramp.work-orders.manage-responsible') && !this.isPassenger;
    },
    isPassenger() {
     return qRampStore().getIsPassenger();
    },
    filterCompany() {
      return qRampStore().getFilterCompany();
    },
    filterGates() {
      return workOrderList()
        .getGatesList()
        .filter(item => {
          return Number(item.stationId) === Number(this.form.stationId)
        })
        .map(item =>
        ({
          value: item.id,
          label: item.name
        }));
    },
    filterStation() {
      return workOrderList()
        .getStationList()
        .map(
          item => ({
            label: item.fullName,
            value: item.id
          })
        )
    },
    filterAcType() {
      return workOrderList()
        .getACTypesList()
        .map(
          item => ({
            label: item.model,
            value: item.id
          })
        )
    },
    filterFlyFormRight() {
      return workOrderList()
        .getAirlinesList()
        .map(
          item => ({
            label: item.airlineName,
            value: item.id
          })
        )
    },
    filterResponsible() {
      return workOrderList()
        .getResponsible()
        .map(item => ({
          label: item.fullName,
          value: item.id
        }))
    },
    validateRulesBlock() {
      const rules = !this.isPassenger ? {
        rules: [
          val => !!val || this.$tr('isite.cms.message.fieldRequired')
        ]
      } : {};
      return rules;
    },
    validateRulesField() {
      return val => this.isPassenger || this.form.operationTypeId == OPERATION_TYPE_OTHER ? true : !!val || this.$tr('isite.cms.message.fieldRequired');
    },
    timezoneAirport() {
      const station = workOrderList().getStationList().find(item => item.id == this.form.stationId);
      const airportId = station?.airportId;
      const airport = workOrderList().getAirportsList().find(item => item.id == airportId) || null
      return airport ? momentTimezone.tz(airport.timezone).format("z") : '';
    },
    readonlyOperationType() {
      const { parentId, preFlightNumber, operationTypeId } = this.dataCompoment || {};
      const isOther = Number(operationTypeId) === OPERATION_TYPE_NON_FLIGHT[0]
      const createdInNonFlight = (Boolean(parentId) || !Boolean(preFlightNumber)) && isOther;
      return this.readonly || this.disabledReadonly || createdInNonFlight;
    },
    showFieldScheduleDate() {
      const operationTypeId = Number(this.form.operationTypeId)
      return this.isPassenger && qRampStore().getTypeWorkOrder() !== LABOR && operationTypeId === OPERATION_TYPE_NON_FLIGHT[0]
    },
    isActualInAndActualOut() {
      const isNonFlight = Number(this.dataCompoment.type) === NON_FLIGHT
      const isParentId = Boolean(this.dataCompoment.parentId)
      const showActualInAndActualOut = isNonFlight ? isParentId : true
      return this.isPassenger ? showActualInAndActualOut : true
    },
    formFields() {
      return {
        banner: {
          type: 'banner',
          props: {
            color: 'info',
            icon: 'fas fa-exclamation-triangle',
            message: this.bannerMessage,
          }
        },
        flyFormLeft: {
          customerId: {
            name: 'customerId',
            value: null,
            type: this.readonly ? 'inputStandard' : 'select',
            help: {
              description: 'You can add a new customer to the list if it\'s not available. Type the Customer Name and click on "Create new customer". The Work Order will be created as Ad-Hoc.'
            },
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.customer')}`,
              clearable: true,
              color: "primary",
              'hide-bottom-space': false,
              emitValue: false,
              options: this.newCustumerAdHoc,
              filterByQuery: true,
            },
            loadOptions: {
              delayed: this.getCustomerList,
            },
            label: this.$tr('ifly.cms.form.customer'),
          },
          customCustomerName: {
            name: 'customCustomerName',
            value: null,
            type: this.readonly ? 'inputStandard' : 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.customer')}`,
              clearable: true,
              color: "primary",
              'hide-bottom-space': false
            },
            label: this.$tr('ifly.cms.form.customer'),
          },
          stationId: {
            name: 'stationId',
            value: null,
            type: this.readonly ? 'inputStandard' : 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              selectByDefault: true,
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.station')}`,
              clearable: true,
              color: "primary",
              options: this.filterStation,
              suffix: this.timezoneAirport,
            },
          },
          acTypeId: {
            name: 'acTypeId',
            value: null,
            type: this.readonly ? 'inputStandard' : 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.acType')}`,
              clearable: true,
              color: "primary",
              'hide-bottom-space': false,
              options: this.filterAcType
            },
            label: this.$tr('ifly.cms.form.acType'),
          },
          operationTypeId: {
            name: 'operationTypeId',
            value: null,
            type: this.readonly ? 'inputStandard' : 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonlyOperationType,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.operation')}`,
              clearable: true,
              color: "primary",
              'hide-bottom-space': false,
              options: this.operationTypeList
            },
            label: this.$tr('ifly.cms.form.operation'),
          },
          cancellationType: {
            value: null,
            type: 'select',
            props: {
              vIf: this.isPassenger && !this.validateNoFligth,
              label: 'Cancellation type',
              clearable: true,
              color: "primary",
              options: [
                { label: 'Cancelled Flight', value: 'cancelledFlight' },
                { label: 'Cancelled Flight W/Services', value: 'cancelledFlightWServices' }
              ]
            },
            label: this.$tr('ifly.cms.form.operation'),
          },
          cancellationNoticeTime: {
            value: null,
            type: 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              label: 'Cancellation Notice time entered in Hours',
              vIf: this.validateCancellationNoticeTime && !this.validateNoFligth,
              type: 'number',
            },
            label: this.$tr('ifly.cms.form.operation'),
          },
        },
        flyFormRight: {
          carrierId: {
            name: 'carrierId',
            value: null,
            type: this.readonly ? 'inputStandard' : 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.carrier')}`,
              clearable: true,
              color: "primary",
              'hide-bottom-space': false,
              options: this.filterFlyFormRight
            },
            label: this.$tr('ifly.cms.form.carrier'),
          },
          gateId: {
            name: 'gateId',
            value: null,
            type: this.readonly ? 'inputStandard' : 'select',
            props: {
              vIf: !this.isPassenger && qRampStore().getTypeWorkOrder() !== SECURITY,
              rules: [
                val => this.validateSpecialCharacters(val)
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.gate')}`,
              clearable: true,
              color: "primary",
              options: this.filterGates,
            },
            label: this.$tr('ifly.cms.form.gate'),
          },
          statusId: {
            value: null,
            type: this.readonly ? 'inputStandard' : 'select',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readStatus,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.status')}`,
              clearable: true,
              color: "primary",
              'hide-bottom-space': false,
              options: workOrderList().getWorkOrderStatusesList()
                .map(
                  item => ({
                    label: item.statusName,
                    value: item.id
                  })
                )

            },
            label: this.$tr('ifly.cms.form.status'),
          },
          responsibleId: {
            name: "responsibleId",
            value: null,
            type: "select",
            props: {
              vIf: this.manageResponsiblePermissions,
              selectByDefault: true,
              readonly: this.disabledReadonly,
              label: 'Assigned to',
              clearable: true,
              color: "primary",
              options: this.isAppOffline ? this.filterResponsible : []
            },
            loadOptions: {
              apiRoute: this.isAppOffline ? null : "apiRoutes.quser.users",
              select: { label: "fullName", id: "id" },
              filterByQuery: !this.isAppOffline,
              requestParams: { filter: { companyId: this.filterCompany } }
            },
          },
          scheduleDate: {
            name: "scheduleDate",
            value: '',
            type: 'fullDate',
            props: {
              vIf: this.showFieldScheduleDate,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              hint:'Format: MM/DD/YYYY HH:mm',
              mask:'MM/DD/YYYY HH:mm',
              'place-holder': 'MM/DD/YYYY HH:mm',
              readonly: this.disabledReadonly,
              label: '*Date Entered',
              clearable: true,
              color:"primary",
              format24h: true,
            },
          },
          preFlightNumber: {
            value: '',
            type: 'input',
            props: {
              vIf: this.showFieldScheduleDate,
              color: 'primary',
              readonly: !!this.dataCompoment.parentId,
              clearable: true,
              label: 'Flight Number',
            },
          }
        },
        inboundLeft: {
          inboundFlightNumber: {
            name: 'inboundFlightNumber',
            value: '',
            type: this.readonly ? 'inputStandard' : 'search',
            props: {
              rules: [
                val => this.validateRulesField(val)
              ],
              hint: 'Enter the fight number and press enter or press the search icon',
              loading: this.loadingState,
              readonly: this.readonly || this.disabledReadonly || this.loadingState,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.flight')}`,
              clearable: true,
              maxlength: 7,
              color: "primary"
            },
            label: this.$tr('ifly.cms.form.flight'),
          },
          inboundOriginAirportId: {
            name: 'inboundOriginAirportId',
            value: '',
            type: this.readonly ? 'inputStandard' : 'select',
            props: {
              readonly: this.isPassenger ? false : (this.disabledReadonly || this.flightBoundFormStatus.boundOriginAirportId),
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `${this.$tr('ifly.cms.form.origin')}`,
              clearable: true,
              color: "primary",
              suffix: this.timezoneAirport,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airports',
              select: { label: 'fullName', id: 'id' },
              requestParams: { filter: { status: this.refresh, companyId: this.filterCompany } }
            },
            label: this.$tr('ifly.cms.form.origin'),
          },
          inboundTailNumber: {
            name: 'inboundTailNumber',
            value: '',
            type: this.readonly ? 'inputStandard' : 'input',
            props: {
              readonly: this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `${this.$tr('ifly.cms.form.tail')}`,
              clearable: true,
              color: "primary"
            },
            label: this.$tr('ifly.cms.form.tail'),
          },
          inboundScheduledArrival: {
            name: 'inboundScheduledArrival',
            value: '',
            type: this.readonly ? 'inputStandard' : 'fullDate',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              hint: 'Format: MM/DD/YYYY HH:mm',
              mask: 'MM/DD/YYYY HH:mm',
              'place-holder': 'MM/DD/YYYY HH:mm',
              outlined: !this.readonly,
              borderless: this.readonly,
              label: `*${this.$tr('ifly.cms.form.scheduledArrival')}`,
              clearable: true,
              color: "primary",
              format24h: true,
              suffix: this.timezoneAirport,
            },
            label: this.$tr('ifly.cms.form.scheduledArrival'),
          },
          inboundGateArrival: {
            name: 'inboundGateArrival',
            value: '',
            type: 'input',
            props: {
              vIf: this.isPassenger,
              label: 'Inbound Gate Arrival',
              clearable: true,
              color: "primary"
            },
            label: 'Inbound Gate Arrival',
          }
        },
        outboundRight: {
          outboundFlightNumber: {
            name: 'outboundFlightNumber',
            value: '',
            type: this.readonly ? 'inputStandard' : 'search',
            props: {
              rules: [
                val => this.validateRulesField(val)
              ],
              hint: 'Enter the fight number and press enter or press the search icon',
              loading: this.loadingState,
              readonly: this.readonly || this.disabledReadonly || this.loadingState,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.flight')}`,
              clearable: true,
              maxlength: 7,
              color: "primary"
            },
            label: this.$tr('ifly.cms.form.flight'),
          },
          outboundDestinationAirportId: {
            name: 'outboundDestinationAirportId',
            value: '',
            type: this.readonly ? 'inputStandard' : 'select',
            props: {
              readonly: this.isPassenger ? false : (this.disabledReadonly || this.flightBoundFormStatus.boundDestinationAirport),
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `${this.$tr('ifly.cms.form.destination')}`,
              clearable: true,
              color: "primary",
              suffix: this.timezoneAirport,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airports',
              select: { label: 'fullName', id: 'id' },
              requestParams: { filter: { status: this.refresh, companyId: this.filterCompany } }
            },
            label: this.$tr('ifly.cms.form.destination'),
          },
          outboundTailNumber: {
            name: 'outboundTailNumber',
            value: '',
            type: this.readonly ? 'inputStandard' : 'input',
            props: {
              readonly: this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `${this.$tr('ifly.cms.form.tail')}`,
              clearable: true,
              color: "primary"
            },
            label: this.$tr('ifly.cms.form.tail'),
          },
          outboundScheduledDeparture: {
            name: 'outboundScheduledDeparture',
            value: '',
            type: this.readonly ? 'inputStandard' : 'fullDate',
            props: {
              rules: [
                val => val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              hint: 'Format: MM/DD/YYYY HH:mm',
              mask: 'MM/DD/YYYY HH:mm',
              'place-holder': 'MM/DD/YYYY HH:mm',
              outlined: !this.readonly,
              borderless: this.readonly,
              label: `*${this.$tr('ifly.cms.form.scheduledDeparture')}`,
              clearable: true,
              color: "primary",
              format24h: true,
              suffix: this.timezoneAirport,
            },
            label: this.$tr('ifly.cms.form.scheduledDeparture'),
          },
          outboundGateDeparture: {
            name: 'outboundGateDeparture',
            value: '',
            type: 'input',
            props: {
              vIf: this.isPassenger,
              label: 'Outbound Gate Departure',
              clearable: true,
              color: "primary"
            },
            label: 'Outbound Gate Departure',
          },
        },
        dateBound: {
          inboundBlockIn: {
            name: 'inboundBlockIn',
            value: '',
            type: this.readonly ? 'inputStandard' : 'fullDate',
            props: {
              ...this.validateRulesBlock,
              hint: 'Format: MM/DD/YYYY HH:mm',
              mask: 'MM/DD/YYYY HH:mm',
              'place-holder': 'MM/DD/YYYY HH:mm',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: `${this.isPassenger ? 'Actual In' : `*${this.$tr('ifly.cms.form.blockIn')}`}`,
              clearable: true,
              color: "primary",
              format24h: true,
              options: (date, min) => this.validateFutureDateTime(date, min, this.form.inboundBlockIn),
              suffix: this.timezoneAirport,
            },
            label: `${this.isPassenger ? 'Actual In' : `${this.$tr('ifly.cms.form.blockIn')}`}`,
          },
          outboundBlockOut: {
            name: 'outboundBlockOut',
            value: '',
            type: this.readonly ? 'inputStandard' : 'fullDate',
            props: {
              ...this.validateRulesBlock,
              hint: 'Format: MM/DD/YYYY HH:mm',
              mask: 'MM/DD/YYYY HH:mm',
              'place-holder': 'MM/DD/YYYY HH:mm',
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: `${this.isPassenger ? 'Actual Out' : `*${this.$tr('ifly.cms.form.blockOut')}`}`,
              clearable: true,
              color: "primary",
              format24h: true,
              options: this.validateDateOutboundBlockOut,
              suffix: this.timezoneAirport,
            },
            label: `${this.isPassenger ? 'Actual Out' : `${this.$tr('ifly.cms.form.blockOut')}`}`,
          },
        },
        customerField: {
          customCustomerName: {
            name: 'customCustomerName',
            value: '',
            type: this.readonly ? 'inputStandard' : 'input',
            props: {
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: this.readonly || this.disabledReadonly,
              outlined: !this.readonly,
              borderless: this.readonly,
              label: this.readonly ? '' : `*${this.$tr('ifly.cms.form.customCustomerName')}`,
              clearable: true,
              color: "primary"
            },
            label: this.$tr('ifly.cms.form.gate'),
          },
        }
      }
    },
    showFieldScheduleDate() {
      const operationTypeId = Number(this.form.operationTypeId)
      return this.isPassenger && operationTypeId === OPERATION_TYPE_NON_FLIGHT[0]
    },
    delayList: {
      get: () => cargoStore().getDelayList(),
      set: (delayList) => {
        cargoStore().setDelayListData(delayList);
      }
    },
    isCollapse() {
      return store().getIsLoading();
    }
  },
  methods: {
    init() {
      this.currentDate()
      this.updateData()
      this.form.stationId = this.dataCompoment.stationId
    },
    async updateData() {
      if (this.dataCompoment && Object.keys(this.dataCompoment).length > 0) {
        store().setIsLoading(false);
        this.update = true
        const updateForm = this.$clone(this.dataCompoment)
        this.form.statusId = updateForm.statusId
        this.form.stationId = updateForm.stationId
        this.form.acTypeId = updateForm.acTypeId
        this.form.adHoc = updateForm.adHoc
        this.form.carrierId = updateForm.carrierId
        this.form.customCustomer = updateForm.customCustomer
        this.form.customerId = updateForm.customerId
        if (qRampStore().isNonFlight()) {
            this.form.scheduleDate = this.dateFormatterFull(updateForm.scheduleDate)
        }
        if(updateForm.customCustomerName) {
          const id = `customer-${this.numberInRange(8000, 1000)}`;
          const objData = { id, label: updateForm.customCustomerName, value: updateForm.customCustomerName };
          this.newCustumerAdHoc = [{ ...objData }];
          this.selectCustomerComputed = { ...objData };
        } else {
          const customer = await workOrderList().getCustomerWithContractLists().find(item => {
            if (updateForm.customerId && updateForm.contractId) {
              return item.id == updateForm.customerId && item.contractId == updateForm.contractId
            }
            if (updateForm.customerId && !updateForm.contractId) {
              return item.id == updateForm.customerId && item.contractId == null;
            }
          }) || null;
          if (customer) {
            if (customer.label) {
              this.selectCustomerComputed = customer;
            }
          }
        }

        this.form.date = updateForm.date
        this.form.gateId = updateForm.gateId
        this.form.operationTypeId = updateForm.operationTypeId
        setTimeout(() => {
          this.form.date = this.dateFormatterFull(updateForm.date)
          this.update = false
          this.form.responsibleId = updateForm.responsibleId;
          this.form.inboundFlightNumber = updateForm.inboundFlightNumber
          this.form.outboundFlightNumber = updateForm.outboundFlightNumber
          this.form.inboundOriginAirportId = updateForm.inboundOriginAirportId
          this.form.inboundTailNumber = updateForm.inboundTailNumber;
          this.flightBoundFormStatus.boundTailNumber = this.checkIfDataArrives(updateForm.inboundTailNumber);
          this.flightBoundFormStatus.outboundTailNumber = this.checkIfDataArrives(updateForm.outboundTailNumber);
          this.flightBoundFormStatus.boundScheduled = this.checkIfDataArrives(updateForm.inboundScheduledArrival);
          this.flightBoundFormStatus.boundScheduledDeparture = this.checkIfDataArrives(updateForm.outboundScheduledDeparture);
          this.flightBoundFormStatus.boundOriginAirportId = this.checkIfDataArrives(updateForm.inboundOriginAirportId);
          this.flightBoundFormStatus.boundDestinationAirport = this.checkIfDataArrives(updateForm.outboundDestinationAirportId);
          if (this.isPassenger) {
            this.form.inboundGateArrival = updateForm.inboundGateArrival;
            this.form.outboundGateDeparture = updateForm.outboundGateDeparture;
            this.flightBoundFormStatus.inboundGateArrival = this.checkIfDataArrives(updateForm.inboundGateArrival);
            this.flightBoundFormStatus.outboundGateDeparture = this.checkIfDataArrives(updateForm.outboundGateDeparture);
          }
          this.form.inboundBlockIn = this.dateFormatterFull(updateForm.inboundBlockIn)
          this.form.inboundScheduledArrival = this.dateFormatterFull(updateForm.inboundScheduledArrival)
          this.form.outboundDestinationAirportId = updateForm.outboundDestinationAirportId
          this.form.outboundTailNumber = updateForm.outboundTailNumber
          this.form.outboundScheduledDeparture = this.dateFormatterFull(updateForm.outboundScheduledDeparture)
          this.form.outboundBlockOut = this.dateFormatterFull(updateForm.outboundBlockOut)
          this.form.preFlightNumber = updateForm.preFlightNumber;
          this.form.faFlightId = updateForm.faFlightId;
          if (this.form.inboundBlockIn && this.form.outboundBlockOut) {
            this.differenceHour = qRampStore().getDifferenceInHours(this.form.inboundBlockIn, this.form.outboundBlockOut);
          }
          this.completeFormInbound = this.validateInbound('inboundLeft');
          this.completedFormOutBound = this.validateInbound('outboundRight');
          this.form.cancellationNoticeTime = updateForm.cancellationNoticeTime;
          this.form.cancellationType = updateForm.cancellationType;
          this.validateTimeWithField('inboundScheduledArrival', 'inboundScheduledArrival', 'inbound');
          this.validateTimeWithField('outboundScheduledDeparture', 'outboundScheduledDeparture', 'outbound');

          store().setIsLoading(true);
        }, 1000)
      }
    },
    checkIfDataArrives(data) {
      return (data === null || data === '') ? false : true;
    },
    saveInfo(error) {
      this.$refs.myForm.validate().then(async (success) => {
        if (success) {
          this.saveIndividual();
          this.$emit('isError', error);
        }
        else {
          this.$emit('isError', true)
        }
      })
    },
    saveIndividual() {
      this.$store.commit('qrampApp/SET_FORM_FLIGHT', this.$clone(this.form))
      qRampStore().setDateInboundBlockIn(this.form.inboundBlockIn);
      qRampStore().setDateOutboundBlockOut(this.form.outboundBlockOut);
      qRampStore().setDateOutboundScheduledDeparture(this.form.outboundScheduledDeparture);
      qRampStore().setDateinboundScheduledArrival(this.form.inboundScheduledArrival);
    },
    async menssageValidate() {
      let error = false;
      if (
        this.form.operationTypeId === '3'
        && this.form.inboundFlightNumber
        && this.form.inboundOriginAirportId
        && this.form.inboundTailNumber
        && this.form.inboundScheduledArrival
        && this.form.inboundBlockIn
        && (this.form.outboundBlockOut === '' || this.form.outboundBlockOut === null)
      ) {
        if (await new Promise(resolve => this.$q.dialog({
          ok: this.$tr('isite.cms.label.yes'),
          message: 'Are you sure there is no data for block out?',
          cancel: true,
          persistent: true
        }).onOk(() => resolve(true)).onCancel(() => resolve(false)))) {
          error = false
        } else {
          error = true;
          const out = this.$refs.outboundBlockOut[0];
          if (out) {
            out.$refs.outboundBlockOutInboundLeft.focus();
          }
        }
      }

      return error;
    },
    currentDate() {
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
      this.form.date = this.dateFormatterFull(date)
    },
    search({ type, name }, criteria = null) {
      if (this.isAppOffline) return;
      if (type != 'search') return;
      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
      }
      this.refresh = 0
      this.dataTable = []
      const _this = this
      this.timeoutID = setTimeout(function () {
        criteria = name == 'inboundFlightNumber' ? _this.form.inboundFlightNumber : _this.form.outboundFlightNumber
        if (!criteria || criteria.length < 3) return;

        const params = {
          refresh: true,
          params: {
            filter: { search: criteria.toUpperCase() }
          }
        }
        _this.loadingState = true
        _this.inOutBound = ["3", "4"].includes(_this.form.operationTypeId)
        //Request
        _this.$crud.index('apiRoutes.qfly.flightaware', params).then(response => {
          _this.loadingState = false
          _this.name = name
          if (response.status == 200) {
            _this.form.outboundCustomFlightNumber = false
            _this.form.inboundCustomFlightNumber = false
            _this.refresh = 1
            _this.mainData = response.data
            _this.loadingState = false
            _this.setTable(response.data)
            _this.dialog = true
            qRampStore().setFlightNumberField(name);
          } else if (response.status == 204) {
            const message = _this.$tr("ifly.cms.label.flightMessage").replace("#file_number", criteria);
            _this.$alert.warning({
              mode: 'modal',
              title: _this.$tr('ifly.cms.form.flight'),
              message,
              actions: [
                { label: _this.$tr('isite.cms.label.cancel'), color: 'grey-8' },
                {
                  label: _this.$tr('isite.cms.label.yes'),
                  color: 'primary',
                  handler: () => {
                    _this.validateBound(name);
                  }
                },
              ]
            })
          }
        }).catch(error => {
          _this.resetBound();
          this.loadingState = false;
          this.$alert.error({ message: this.$tr("ifly.cms.message.errorlookingForFlight") });
          console.log('error', error)
        })
      }, 1500)
    },
    validateBound(name) {
      if (!name) return;
      this.form.outboundCustomFlightNumber = true
      qRampStore().showFielFlightBoundFormStatus();
      this.form.inboundCustomFlightNumber = true
      this.dialog = false;
    },
    setForm(data) {
      this.refresh = 0
      const {
        ident,
        destinationAirport,
        estimatedOff,
        registration,
        originAirport,
        estimatedOn,
        gateDestination,
        gateOrigin,
        actualIn,
        actualOut,
      } = data;
      if (!this.isbound[0] && this.isbound[1]) {
        const destinationAirportId = destinationAirport?.id || null;
        this.form.outboundFlightNumber = ident
        this.form.outboundDestinationAirportId = destinationAirportId
        this.form.outboundScheduledDeparture = this.dateFormatterFull(estimatedOff)
        this.form.outboundTailNumber = registration
        if (this.isPassenger) this.form.inboundGateArrival = gateDestination
      }
      if (this.isbound[0] && !this.isbound[1]) {
        this.form.inboundFlightNumber = ident
        const originAirportId = originAirport?.id || null;
        this.form.inboundOriginAirportId = originAirportId
        this.form.inboundScheduledArrival = this.dateFormatterFull(estimatedOn)
        this.form.inboundTailNumber = registration
        if (this.form.outboundTailNumber) {
          this.form.outboundTailNumber = registration
        }
        if (this.isPassenger) this.form.outboundGateDeparture = gateOrigin
      }
      if (this.isbound[0] && this.isbound[1]) {
        if (this.name.includes('inboundFlightNumber')) {
          const destinationAirportId = destinationAirport?.id || null;
          this.form.outboundFlightNumber = ident
          this.form.outboundDestinationAirportId = destinationAirportId
          this.form.outboundScheduledDeparture = this.dateFormatterFull(estimatedOff)
          this.form.outboundTailNumber = registration
          if (this.isPassenger) this.form.outboundGateDeparture = gateOrigin
          if (this.isPassenger) this.form.inboundGateArrival = gateDestination
          this.form.inboundFlightNumber = ident
          const originAirportId = originAirport?.id || null;
          this.form.inboundOriginAirportId = originAirportId
          this.form.inboundScheduledArrival = this.dateFormatterFull(estimatedOn)
          this.form.inboundTailNumber = registration
          if (this.form.outboundTailNumber) {
            this.form.outboundTailNumber = registration
          }
        } else {
          const destinationAirportId = destinationAirport?.id || null;
          this.form.outboundFlightNumber = ident
          this.form.outboundDestinationAirportId = destinationAirportId
          this.form.outboundScheduledDeparture = this.dateFormatterFull(estimatedOff)
          this.form.outboundTailNumber = registration
          if (this.isPassenger) this.form.inboundGateArrival = gateDestination
        }
      }
      if (this.isPassenger) {
        this.form.inboundBlockIn = this.dateFormatterFull(actualIn)
        this.form.outboundBlockOut = this.dateFormatterFull(actualOut)
        this.changeDate({
          name: 'outboundBlockOut'
        });

      }
      qRampStore().validateStatusSelectedFlight(data);
    },
    setDataTable({ select, dialog }) {
      this.dialog = dialog
      this.form.faFlightId = select.faFlightId || null;
      this.setForm(this.mainData.find((item, index) => {
        return index === select.index
      }))
    },
    dateFormatterFull(rawDate) {
      if (!rawDate) return null
      return moment(rawDate).format('MM/DD/YYYY HH:mm')
    },
    setTable(data) {
      try {
        this.dataTable = qRampStore().getTableListOfFlights(data);
      } catch (error) {
        this.dataTable = [];
        console.log(error);
      }
    },
    validateSpecialCharacters(val) {
      if (/[^a-zA-Z0-9-]/.test(val)) {
        return this.$tr('isite.cms.message.specialCharactersAreNotAllowed');
      }
      return !!val || this.$tr('isite.cms.message.fieldRequired');
    },
    async setCustomerForm() {
      const selectCustomers = this.selectCustomers === null ||
        this.selectCustomers === undefined ||
        this.selectCustomers === '' ? {} : this.selectCustomers;
      this.form.customerId = (isNaN(selectCustomers.id)) ? null : selectCustomers.id;
      const customCustomerName = selectCustomers.label || null;
      this.form.customCustomerName = this.form.customerId ? null : customCustomerName;
      this.form.contractId = selectCustomers.contractId || null;
      qRampStore().setContractId(this.form.contractId);
      const message = this.form.contractId
        ? `${this.$tr('ifly.cms.message.selectedCustomerWithContract')}`
        : this.$tr('ifly.cms.message.selectedCustomerWithoutContract');

      this.bannerMessage = selectCustomers && this.form.customerId !== null && !this.form.contractId ? message : null;
      this.form.adHoc = this.form.contractId ? false : true;
      this.form.customCustomer = this.form.contractId ? false : true;
      await this.reFilterFavorites();
    },
    setCustomerName(query) {
      this.customerName = query !== '' ? query : '';
    },
    addCustumers() {
      if (this.customerName !== '') {
        const id = `customer-${this.numberInRange(8000, 1000)}`;
        this.newCustumerAdHoc = [{ id, label: this.customerName, value: this.customerName }];
        this.form.adHoc = true;
        this.form.customCustomer = true;
        this.bannerMessage = this.$tr('ifly.cms.message.requestNewCustomer');
        this.selectCustomerComputed = {
          id,
          value: this.customerName,
          label: this.customerName,
        }
        this.form.customCustomerName = this.customerName;
        this.form.customerId = null;
        this.form.contractId = null;
        this.customerName = '';
        return;
      }
      this.$alert.error({ message: this.$tr('ifly.cms.message.orderaddNewrecord') });
    },
    numberInRange(max, min) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    getCustomerList() {
      return new Promise(async (resolve) => {
        const customerList = await workOrderList().getCustomerWithContract();
        return resolve(customerList);
      })
    },
    handleScroll(event) {
      if (this.$refs.customerId || this.$refs.customerId.length > 0) {
        if (this.$refs.customerId.some(item => item.tooltip)) {
          this.$refs.customerId[0].tooltip = false;
        }
      }
    },
    resetBound() {
      this.form.outboundCustomFlightNumber = false
      this.form.inboundCustomFlightNumber = false
    },
    async resetField(key = '') {
      if (key === 'stationId') {
        this.timezoneAirport;
        this.form.gateId = null;

        await this.reFilterFavorites()

        this.validateTimeWithField('inboundScheduledArrival', key, 'inbound');
        this.validateTimeWithField('outboundScheduledDeparture', key, 'outbound');
        this.setTimeDelayList();
        return;
      }
      if (key === 'operationTypeId') {
        await this.reFilterFavorites()
      }
      if (key === 'carrierId') {
        await this.reFilterFavorites()
      }
      if (!this.form.operationTypeId) return;
      this.$refs.myForm.reset();
      const data = {
        destinationAirport: {
          id: this.form.inboundOriginAirportId,
        },
        registration: this.form.inboundTailNumber,
        outRegistration: this.form.outboundTailNumber,
        originAirport: {
          id: this.form.outboundDestinationAirportId,
        },
        estimatedOff: this.form.outboundScheduledDeparture,
        estimatedOn: this.form.inboundScheduledArrival,
      }
      qRampStore().validateStatusSelectedFlight(data);
      this.resetBound();
      this.$store.commit('qrampApp/SET_FORM_FLIGHT', this.$clone(this.form));
    },
    validateDate(dateTime, dateMin = null) {
      const date = this.form.inboundScheduledArrival
        ? this.$moment(this.form.inboundScheduledArrival) : this.$moment();
      const today = date.format('YYYY/MM/DD');
      const hour = date.format('H');
      const min = date.format('mm');
      const validateDate = today === this.$moment(this.form.inboundBlockIn).format('YYYY/MM/DD');
      if (isNaN(dateTime)) {
        return dateTime <= this.$moment().format('YYYY/MM/DD') && dateTime >= today;
      }
      if (dateMin) {
        return validateDate ? Number(dateMin) <= min : true;
      }
      return validateDate ? dateTime <= hour : true;
    },
    validateDateOutboundBlockOut(dateTime, dateMin = null) {
      const outboundScheduledDepartureDate = this.form.outboundBlockOut
        ? this.$moment(this.form.outboundBlockOut) : this.$moment();
      const today = outboundScheduledDepartureDate.format('YYYY/MM/DD');
      const inboundBlockIn = this.form.inboundBlockIn
        ? this.$moment(this.form.inboundBlockIn) : this.$moment();
      const todayIn = inboundBlockIn.format('YYYY/MM/DD')
      const hourIn = inboundBlockIn.format('H');
      const minIn = inboundBlockIn.format('mm');
      const validateDate = today === todayIn;

      if (isNaN(dateTime)) {
        if (this.form.inboundBlockIn) {
          return dateTime <= this.$moment().format('YYYY/MM/DD')
            && dateTime >= todayIn;
        }
        return dateTime <= this.$moment().format('YYYY/MM/DD')
          && dateTime >= today;
      }
      if (dateMin) {
        return validateDate ? Number(dateMin) >= Number(minIn) : true;
      }
      return validateDate ? Number(dateTime) >= Number(hourIn) : true;
    },
    changeDate(field) {
      if (field.name === 'outboundBlockOut' && this.form.outboundBlockOut !== null) {
        this.differenceHour = qRampStore().getDifferenceInHours(this.form.inboundBlockIn, this.form.outboundBlockOut);
      }
      this.validateTimeWithField('inboundScheduledArrival', field.name, 'inbound');
      this.validateTimeWithField('outboundScheduledDeparture', field.name, 'outbound');
      this.setTimeDelayList();
    },
    optionResponsible(item) {
      return item ? [{ id: String(item.id), label: item.fullName, value: item.id }] : [];
    },
    zanetizeData(key) {
      this.completeFormInbound = this.validateInbound('inboundLeft');
      this.completedFormOutBound = this.validateInbound('outboundRight');
      if (key === 'inboundFlightNumber' || key === 'outboundFlightNumber') {
        if (this.form[key]) {
          this.form[key] = this.form[key].toUpperCase().replace(/\s+/g, '');
        }
      }
      this.validateTimeWithField('inboundScheduledArrival', key, 'inbound');
      this.validateTimeWithField('outboundScheduledDeparture', key, 'outbound');
      this.$store.commit('qrampApp/SET_FORM_FLIGHT', this.$clone(this.form));
    },
    setTimeDelayList(){
      if (this.isPassenger)
      {
        const inbound = this.differenceTimeMinute.inbound;
        const outbound = this.differenceTimeMinute.outbound;
        let time = [{code: null, hours: null}];
        if(this.isbound[0] && !this.isbound[1] && inbound > this.delayMinute) {
          time[0].hours = inbound;
          this.differenceTimeMinute.outbound = 0;
        }
        if(!this.isbound[0] && this.isbound[1] && outbound > this.delayMinute) {
          time[0].hours = outbound;
          this.differenceTimeMinute.inbound = 0;
        }
        if(this.isbound[0] && this.isbound[1] ) {
          if(OPERATION_TYPE_TURN_PASSENGER == this.form.operationTypeId && outbound > this.delayMinute) {
            time[0].hours = outbound;
            this.differenceTimeMinute.inbound = 0;
          }
          if (OPERATION_TYPE_TURN_PASSENGER != this.form.operationTypeId && (inbound > this.delayMinute || outbound > this.delayMinute)) {
            time = [{
              code: null,
              hours: inbound,
            },{
              code: null,
              hours: outbound,
            }].filter(item => item.hours > this.delayMinute);
          }
        }
        const delay = this.delayList.filter(item => item.hours && item.code);
        if(delay.length > 0) return;
        this.delayList = [...time];
      } else {
        this.differenceTimeMinute.inbound = 0;
        this.differenceTimeMinute.outbound = 0;
      }
    },
    validateInbound(keyForm) {
      const dataForm = [];
      Object.keys(this.formFields[keyForm]).forEach(key => {
        dataForm.push(this.checkIfDataArrives(this.form[key]));
      });
      if (!this.isPassenger) {
        dataForm.pop();
      }
      return dataForm.every(item => item === true);
    },
    async reFilterFavorites() {
      store().setForm(this.form);
      this.$store.commit('qrampApp/SET_FORM_FLIGHT', this.$clone(this.form));
      await workOrderList().getFavourites(true)
      const servicesList = serviceListStore().getServiceList()
      updateFavoriteServicesList(servicesList);
    },
    differenceMinutesDate(start, end) {
      if(!start && !end) return 0;
      const format = 'MM/DD/YYYY HH:mm';
      const dateStart = moment(start, format);
      const dateEnd = moment(end, format);
      const diffMinutes = dateStart.diff(dateEnd, 'minutes');
      return Math.max(0, diffMinutes);
    },
    validateTimeWithField(field, fieldName, column) {
      const fieldColumnName = column === 'inbound' ? 'inboundBlockIn' : 'outboundBlockOut';
      if(
          this.isPassenger &&
          this.form[fieldColumnName] !== null
      ) {
        if(OPERATION_TYPE_TURN_PASSENGER == this.form.operationTypeId && column === 'inbound') return;
        this.differenceTimeMinute[column] = this.differenceMinutesDate(this.form[fieldColumnName], this.form[field]);
      }
    }
  },
}
</script>

<style lang="scss" scoped>
#formFlyStep {
  #origin {
    padding-bottom: 0px;
  }

  hr.label-container {
    position: relative;
    bottom: 20px;
    border-top: 1px dashed #000D4726;
    z-index: 1;
  }

  .span {
    padding-bottom: 10px;
  }

  .spanBottom {
    padding-bottom: 15px;
  }

  .card-bound {
    border: 1px solid #f1f4fa;
    border-radius: 8px 8px 0px 0px;
  }
}
</style>
