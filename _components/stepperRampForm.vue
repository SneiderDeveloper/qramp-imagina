<template>
  <div id="stepComponent"
       class="
        bg-white
        dynamicComponent
        stepper-modal"
  >
    <q-stepper
        v-model="sp"
        ref="stepper"
        header-nav
        alternative-labels
        animated
        :contracted="$q.screen.lt.md"
        keep-alive
        active-icon="none"
    >
      <q-step
          v-for="(step, index) in steps"
          :key="index"
          :name="index + 1"
          :title="step.title"
          :icon="step.icon"
          :active-color="error ? 'red' : 'primary'"
          flat
      >
        <component
            :ref="step.ref"
            :is="step.component"
            @isError="error = $event"
            :dataCompoment="step.form || null"
            :readonly="readonly"
            @send-info="sendInfo()"
        />
      </q-step>
    </q-stepper>
  </div>
</template>
<script>
import responsive from '../_mixins/responsive.js'
import {
  STEP_FLIGHT,
  STEP_SERVICE,
  STEP_REMARKS,
  STEP_SIGNATURE,
  BUSINESS_UNIT_PASSENGER,
  BUSINESS_UNIT_RAMP,
  OPERATION_TYPE_OTHER,
  OPERATION_TYPE_NON_FLIGHT,
  STEP_DELAY,
  STATIONS_DELAY,
  FlightFormFieldSecurityModel,
  SECURITY
} from '../_components/model/constants.js'
import qRampStore from '../_store/qRampStore.js'
import serviceListStore from './serviceList/store/serviceList.ts';
import cargoStore from './cargo/store/cargo.ts';
import {
  FlightformFieldModel,
  HalfTurnInBountModel,
  HalfTurnOutBountModel,
  FlightformFieldPassengerModel,
  HalfTurnInBountPassengerModel,
  HalfTurnOutBountPassengerModel
} from './model/constants.js';
import remarkStore from './remarks/store.ts';
import { cacheOffline } from 'src/plugins/utils';
import workOrderList from '../_store/actions/workOrderList.ts'
import storeCargo from 'src/modules/qramp/_components/cargo/store/cargo'
import flightStore from 'src/modules/qramp/_components/flight/store'
import signatureStore from 'src/modules/qramp/_components/signature/store/index.store.ts'

export default {
  name: 'stepperRampForm',
  components: {},
  mixins: [responsive],
  props: {
    steps: {},
    data: {},
  },
  emits: ['sp', 'close','close-modal','loading','getWorkOrders'],
  data() {
    return {
      readonly: false,
      form: {},
      error: false,
      sp: 1,
      STEP_FLIGHT,
      STEP_SERVICE,
      STEP_REMARKS,
      STEP_SIGNATURE,
      disabled: false,
    }
  },
  inject: ['disabledReadonly'],
  mounted() {
    this.$nextTick(async function () {
      await this.init()
    })
  },
  watch: {
    async sp(value, oldStep) {
      await this.saveFormData(oldStep, true);
      this.$emit('sp', value);
    }
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    isPassenger() {
      return qRampStore().getIsPassenger();
    },
    filterBusinessUnit() {
      return this.isPassenger ? BUSINESS_UNIT_PASSENGER : BUSINESS_UNIT_RAMP;
    },
    filterCompany() {
      return qRampStore().getFilterCompany();
    },
    stepError: {
      get() {
        return this.error;
      },
      set(value) {
        this.error = value;
      }
    },
  },
  methods: {
    async init() {
      this.$emit('sp', this.sp)
      await workOrderList().getFavourites(true);
      await serviceListStore().init();
    },
    parseDateOfflineWO(dateWO){
      if (!dateWO && !dateWO?.includes('T')) return dateWO;
      const splitDate = dateWO.split(" ");
      const [date, hour] = splitDate;
      const newDate = new Date(date).toLocaleDateString('fr-CA');
      return `${newDate}T${hour}`;
    },
    async setData() {
      await this.saveFormData(this.sp);
    },
    async saveFormData(step, individual = false) {
      switch (step) {
        case STEP_FLIGHT:
          if (this.$refs.flight) {
            if (individual) {
              this.$refs.flight[0].saveIndividual();
              return;
            }
            ;
            const error = await this.$refs.flight[0].menssageValidate();
            await this.$refs.flight[0].saveInfo(error);
          }
          break;
      }
    },
    camelToSnakeCase(str) {
      return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    },
    formatData(data) {
      const obj = {}
      for (let key in data) {
        const name = this.camelToSnakeCase(key)
        obj[name] = data[key]
      }
      return obj
    },
    async sendInfo() {
      try {
        let businessUnitId = qRampStore().getBusinessUnitId();
        const remarks = remarkStore().getForm();
        const serviceList = await serviceListStore().getServiceListSelected();
        const filterList = await serviceListStore().filterServicesListByQuantity();
        if(filterList.length > 0) {
          await this.setStep(STEP_SERVICE);
          this.error = true;
          qRampStore().hideLoading();
          await this.setData();
          this.$alert.error({message: this.$tr('You have services to correct')});
          return;
        }
        qRampStore().showLoading();
        const validateAllFieldsRequiredByStep = await this.validateAllFieldsRequiredByStep();
        if (validateAllFieldsRequiredByStep) return;
        const data = JSON.parse(JSON.stringify(this.$store.state.qrampApp));
        const dataCargo = cargoStore().payload();
        data.form.statusId = qRampStore().getStatusId();
        let formatData = {
          ...data.form,
          ...signatureStore.form,
          ...dataCargo.cargo,
          ...remarks,
          adHoc: data.form.adHoc == 1,
          customCustomer: data.form.customCustomer == 1,
          delay: dataCargo.delay,
          ourDelay: dataCargo.ourDelay,
          delayComment: dataCargo.delayComment,
          type: qRampStore().getTypeWorkOrder(),
          workOrderItems: [
            ...serviceList
          ],
          businessUnitId,
        }

        if (this.data.update) {
          formatData.id = this.data.workOrderId;
        }
        const service = await serviceListStore().getServiceItems();
        if (this.isPassenger && service.length === 0) {
          this.$alert.warning({
            mode: "modal",
            message: 'Surely you want to save the work order without services',
            actions: [
              {
                label: this.$tr('isite.cms.label.cancel'),
                color: 'grey-8',
                handler: async () => {
                  qRampStore().hideLoading();
                },
              },
              {
                label: this.$tr("isite.cms.label.yes"),
                color: "primary",
                handler: async () => {
                  await this.sendWorkOrder(formatData);
                },
              },
            ],
          });
        } else {
          await this.sendWorkOrder(formatData);
        }
        return formatData;
      } catch (error) {
        qRampStore().hideLoading();
        console.log(error);
      }
    },
    clean() {
      cargoStore().reset();
      this.$store.commit('qrampApp/SET_FORM_FLIGHT', {})
      this.$emit('close', false)
      serviceListStore().setShowFavourite(false)
    },
    async next() {
      await this.setData();
      setTimeout(() => {
        if (this.error) {
          if (this.sp === STEP_SERVICE) {
            const validateDateService = this.validateFulldate();
            if (!validateDateService) {
              this.$alert.error({message: this.$tr('Dates must have this format: MM/DD/YYYY HH:mm')});
            }
          }
          return
        }
        ;
        this.$refs.stepper.next()
      }, 500)
    },
    previous() {
      this.$refs.stepper.previous()
    },
    async updateDataInCache(route, data) {
      const formatDataOffline = structuredClone(data);
      formatDataOffline.offline = true;
      const inboundBlockIn = this.parseDateOfflineWO(formatDataOffline.inboundBlockIn);
      const inboundScheduledArrival = this.parseDateOfflineWO(formatDataOffline.inboundScheduledArrival);
      const outboundBlockOut = this.parseDateOfflineWO(formatDataOffline.outboundBlockOut);
      const outboundScheduledDeparture = this.parseDateOfflineWO(formatDataOffline.outboundScheduledDeparture);
      const workOrder = {
        ...formatDataOffline,
        inboundBlockIn,
        inboundScheduledArrival,
        outboundBlockOut,
        outboundScheduledDeparture
      };
      const camelCaseFormatData = Object.values(this.$helper.snakeToCamelCaseKeys(workOrder.workOrderItems));
      workOrder.workOrderItems = camelCaseFormatData;
      await cacheOffline.updateRecord(route, workOrder, workOrder?.id);
    },
    async sendWorkOrder(formatData) {
      const ROUTE = 'apiRoutes.qramp.workOrders';
      const titleOffline = qRampStore().getTitleOffline();
      const params = {params: {titleOffline}};
      if (this.disabledReadonly) {
        if (!this.data.parent) this.$emit('close-modal', false);
        this.$emit('loading', false);
        return;
      }
      if (this.disabled) return;
      this.disabled = true;
      this.$emit('loading', true)

      await this.updateDataInCache(ROUTE, formatData)

      const request = this.data.update && !this.data?.isClone
        ? this.$crud.update(ROUTE, this.data.workOrderId, formatData, params)
        : this.$crud.create(ROUTE, formatData, params);

      await request.then(async res => {
        this.clean()
        if (!this.data.parent) this.$emit('close-modal', false)
        const message = this.data.update ? `${this.$tr('isite.cms.message.recordUpdated')}`
            : `${this.$tr('isite.cms.message.recordCreated')}`;
        this.$alert.info({message})
        this.$emit('loading', false)
        this.disabled = false;
        qRampStore().hideLoading();
        await this.$emit('getWorkOrders', formatData);
      })
      .catch(async err => {
        qRampStore().hideLoading();
        this.disabled = false;
        this.$emit('loading', false)
        this.$emit('close-modal', false);
        await this.$emit('getWorkOrders', formatData);
        if (!this.isAppOffline) {
          this.$alert.error({message: `${this.$tr('isite.cms.message.recordNoUpdated')}`})
          console.log('SEND INFO ERROR:', err)
        }
      })
    },
    validateFulldate() {
      return new Promise(async (resolve) => {
        let validate = true;
        const services = await serviceListStore().getServiceItems();
        services.forEach((service) => {
          service.work_order_item_attributes.forEach((attr) => {
            if (attr.type === 'fullDate') {
              if (!this.$moment(attr.value, 'MM/DD/YYYY HH:mm', true).isValid()) {
                validate = false;
                return;
              }
            }
          })
        })
        return resolve(validate);
      })
    },
    async validateAllFieldsRequiredByStep() {
      try {
        const flightForm = this.$store.state.qrampApp.form;
        let flightformField = this.isPassenger ? FlightformFieldPassengerModel : FlightformFieldModel;
        let halfTurnInBount = this.isPassenger || flightForm.operationTypeId == OPERATION_TYPE_OTHER
        ?  HalfTurnInBountPassengerModel : HalfTurnInBountModel;
        let halfTurnOutBount = this.isPassenger || flightForm.operationTypeId == OPERATION_TYPE_OTHER
        ? HalfTurnOutBountPassengerModel : HalfTurnOutBountModel;
        if(this.isPassenger && flightForm.operationTypeId == OPERATION_TYPE_NON_FLIGHT[0]) {
          halfTurnInBount = [];
          halfTurnOutBount = [];
          flightformField = flightformField.concat(['scheduleDate']);
        }
        if(!this.isPassenger && flightForm.operationTypeId != OPERATION_TYPE_OTHER) {
          flightformField = flightformField.concat(['inboundBlockIn', 'outboundBlockOut']);
        }

        if(!flightForm.customCustomerName) {
          flightformField = flightformField.concat(['customerId']);
        }

        if(!this.isPassenger && qRampStore().getTypeWorkOrder() === SECURITY) {
          flightformField = FlightFormFieldSecurityModel;
        }

        const operationType = workOrderList().getOperationTypeList()
          .find(item => item.id === Number(flightForm.operationTypeId));
        const type = operationType?.options?.type;

        if(type) {
          if(type === 'full'){
            const bount = halfTurnInBount.concat(halfTurnOutBount);
            flightformField = flightformField.concat(bount);
          }
          if(type === 'inbound') {
            flightformField = flightformField.concat(halfTurnInBount);
          }
          if(type === 'outbound') {
            flightformField = flightformField.concat(halfTurnOutBount);
          }
        }
        const cancellationType =  flightForm.cancellationType;
        if(cancellationType) {
          flightformField = flightformField.concat(['cancellationNoticeTime']);
        }
        const validateflightform = flightformField
            .some(item => flightForm[item] === null || flightForm[item] === '')
        if (validateflightform) {
          this.error = true;
          await this.setStep(STEP_FLIGHT);
          qRampStore().hideLoading();
          await this.setData();
          this.$alert.error({message: this.$tr('isite.cms.message.formInvalid')})
          return true;
        }
        const validateDateService = await this.validateFulldate();
        const service = await serviceListStore().getServiceItems();
        if (!this.isPassenger && service.length === 0) {
          await this.setStep(STEP_SERVICE);
          this.error = true;
          qRampStore().hideLoading();
          await this.setData();
          this.$alert.error({message: this.$tr('Please at least select one service')});
          return true;
        }

        if (!validateDateService) {
          this.$alert.error({message: this.$tr('Dates must have this format: MM/DD/YYYY HH:mm')});
          await this.setStep(STEP_SERVICE);
          this.error = true;
          await this.setData();
          qRampStore().hideLoading();
          return true;
        }
        const delayList = storeCargo().getDelayList();
        const validateDelayCode = delayList.some((item) => item.code && item.code.startsWith("99"));
        const hasValidCodeAndHours = delayList.some(item => (item.code === '' || item.code === null) && item.hours);
        const delayComment = storeCargo().getDelayComment();
        const hasCodeAndInvalidHours = delayList.some(item => item.code && (!item.hours || item.hours == 0));

        if (this.isPassenger) {
          const delays = flightStore().getDifferenceTimeMinute();
          const message = `You have to enter the at least one delay reason for the ${delays.inbound || delays.outbound}min delay time for flight`
          if(delayList.length === 0) {
            const differenceTimeMinute = flightStore().getDifferenceTimeMinute();
            const inbound = differenceTimeMinute.inbound;
            const outbound = differenceTimeMinute.outbound;
            let time = [{code: null, hours: null}]
            if(type) {
              if(type === 'full'){
                time = [{
                  code: null,
                  hours: inbound,
                },{
                  code: null,
                  hours: outbound,
                }].filter(item => item.hours > 0)
              }
              if(type === 'inbound') {
                time[0].hours = inbound;
              }
              if(type === 'outbound') {
                time[0].hours = outbound;
              }
            }

            storeCargo().setDelayListData(time)
            return await this.handleError(message);
          }
          if (hasCodeAndInvalidHours) {
            return await this.handleError("You have data with empty or zero time");
          }

          if (hasValidCodeAndHours) {
            return await this.handleError(message);
          }

          if (validateDelayCode && !delayComment) {
            return await this.handleError(this.$tr('isite.cms.message.formInvalid'));
          }
        }
        this.error = false;
        return false;
      } catch (error) {
        console.log(error);
        qRampStore().hideLoading();
      }
    },
    async setStep(value) {
      this.sp = value;
    },
    isError(value) {
      this.stepError = value;
    },
    async handleError(message) {
      await this.setStep(STEP_DELAY);
      this.error = true;
      qRampStore().hideLoading();
      await this.setData();
      this.$alert.error({ message });
      await this.$refs.delay[0].$refs.cargoDelay.validate()
      return true;
    }
  },
}
</script>
<style>
.stepper-modal .q-stepper .q-stepper-title {
  @apply tw-relative tw-mb-6 tw-overflow-x-hidden;
}

.stepper-modal .q-stepper .q-stepper-title > h3 {
  @apply tw-text-lg tw-font-bold tw-bg-white tw-pr-4 tw-inline-block tw-z-20 tw-relative;
}

.stepper-modal .q-stepper .q-stepper-title > div {
  @apply tw-block tw-w-full tw-h-px tw-bg-gray-200 tw-top-2/4 tw-absolute tw-z-10;
}

.stepper-modal .q-stepper {
  @apply tw-border-0 tw-shadow-none;
}

.stepper-modal .q-stepper__header {
  @apply tw-border-b-0;
}

.stepper-modal .q-stepper__tab .q-stepper__dot {
  @apply md:tw-w-10 md:tw-h-10 tw-font-bold md:tw-text-base tw-border-0;
}

.stepper-modal .q-stepper__tab .q-stepper__dot .q-icon {
  @apply tw-text-xs sm:tw-text-sm md:tw-text-xl;
}

.stepper-modal .q-stepper__header--contracted .q-stepper__tab:first-child .q-stepper__dot {
  @apply tw-transform tw-translate-x-3.5;
}

.stepper-modal .q-stepper__header--contracted .q-stepper__tab:last-child .q-stepper__dot {
  @apply tw-transform tw--translate-x-3.5;
}

.stepper-modal .q-stepper__tab:not(.q-stepper__tab--active) .q-stepper__dot {
  @apply tw-border-2;
  background-color: #F1F4FA;
  border-color: #F1F4FA;
}

.stepper-modal .q-stepper__tab:not(.q-stepper__tab--active) .q-stepper__dot span {
  color: #8A98C3;
  font-size: 20px;
}

.stepper-modal .q-stepper__tab--active .q-stepper__dot {
  @apply tw-border-current tw-border-2;
}

.stepper-modal .text-red.q-stepper__tab--active .q-stepper__dot {
  @apply tw-border-current tw-border-2;
}

.stepper-modal .q-stepper__tab--active .q-stepper__dot span {
  @apply tw-text-white;
}

.stepper-modal .q-stepper .q-stepper__dot:before {
  @apply lg:tw-mr-8;
}

.stepper-modal .q-stepper .q-stepper__dot:after {
  @apply lg:tw-ml-8;
}

.stepper-modal .q-stepper .q-stepper__line:after,
.stepper-modal .q-stepper .q-stepper__line:before {
  @apply tw-h-0.5;
}

.stepper-modal .q-stepper__title {
  @apply tw-text-base tw-font-normal tw-text-black;
}

.stepper-modal .q-stepper__step-inner {
  @apply tw-py-4 lg:tw-py-0 tw-px-0 lg:tw-px-0;
}

.stepper-modal .q-stepper__step-inner .q-form {
  @apply tw-px-4 lg:tw-px-5;
}

.q-stepper__header--alternative-labels .q-stepper__tab {
  @apply tw-py-5 tw-px-0;
}

.stepper-modal .q-stepper .q-stepper__dot:before {
  @apply lg:tw-mr-5;
}

.stepper-modal .q-stepper .q-stepper__dot:after {
  @apply lg:tw-ml-5;
}

.stepper-modal .q-stepper__title {
  color: #1F294F;
}

.q-stepper__dot {
  @apply tw-w-10 tw-h-10;
  min-width: 40px;
}

.stepper-modal .q-stepper__tab:not(.q-stepper__tab--active) .q-stepper__dot span {
  @apply tw-text-xl;
}

.stepper-modal .q-stepper__tab .q-stepper__dot .q-icon {
  @apply tw-text-xl;
}

.q-panel-parent {
  @apply tw-mb-5;
}

#formRampComponent .master-dialog__actions {
  @apply tw-py-4 tw-px-2 md:tw-px-7 tw-absolute tw-w-full tw-bottom-0;
  background-color: #F1F4FA;
}

#formRampComponent .master-dialog__body {
  @apply tw-p-0 tw-m-0;
}
</style>

