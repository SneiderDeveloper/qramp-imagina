<template>
  <div>
    <master-modal id="formRampComponent" v-model="show" v-bind="modalProps" :persistent="true" :loading="loading"
      @hide="clear" :actions="actions" :width="modalProps.width" :maximized="$q.screen.lt.md">
      <stepper-ramp-form v-if="modalProps.update" @sp="sp = $event" @loading="setLoading" ref="stepper"
        :steps="steppers" :data="modalProps" @close-modal="close($event)" @getWorkOrders="getWorkOrders" />
      <simpleWorkOrders v-if="!modalProps.update" ref="simpleWorkOrder" @loading="setLoading" @refreshData="$emit('refresh-data')"/>
    </master-modal>
  </div>
</template>
<script>
import { computed } from 'vue';
import stepperRampForm from '../_components/stepperRampForm.vue'
import responsive from '../_mixins/responsive.js'
import {
  STATUS_DRAFT,
  STATUS_POSTED,
  STATUS_SUBMITTED,
  STATUS_SCHEDULE,
  STATUS_CLOSED,
  STEP_FLIGHT,
  STEP_SERVICE,
  STEP_REMARKS,
  STEP_SIGNATURE,
  NON_FLIGHT,
  modalFullProps
} from '../_components/model/constants.js'
import qRampStore from '../_store/qRampStore.js'
import simpleWorkOrders from './simpleWorkOrders.vue'
import serviceListStore from './serviceList/store/serviceList';
import cargoStore from './cargo/store/cargo.ts';
import storeFlight from './flight/store.ts';
import iFlight from './flight/flight.vue'
import iRemarks from './remarks/index.vue'
import iSignature from '../_components/signature/signature.vue';
import serviceList from './serviceList/index.vue';
import remarksStore from './remarks/store.ts';
import workOrderList from '../_store/actions/workOrderList';
import delayComponent from '../_components/cargo/delayComponent';
import { constructionWorkOrder } from 'src/modules/qramp/_store/actions/constructionWorkOrder'
import getWorkOrder from "src/modules/qramp/_components/scheduleKanban/actions/showWorkOrders"
import { cacheOffline } from 'src/plugins/utils';
import signatureStore from 'src/modules/qramp/_components/signature/store/index.store.ts'

export default {
  emits: ['getWorkOrderFilter', 'refresh-data'],
  components: {
    stepperRampForm,
    simpleWorkOrders,
  },
  mixins: [responsive],
  data() {
    return {
      show: false,
      loading: false,
      modalProps: {},
      sp: null,
      flight: {},
      remark: [],
      signature: [],
      statusId: STATUS_DRAFT,
      needToBePosted: false,
      STATUS_DRAFT,
      STATUS_POSTED,
      STATUS_SUBMITTED,
    }
  },
  provide() {
    return {
      disabledReadonly: computed(() => qRampStore().disabledReadonly()),
      closeModal: this.close
    }
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    isPassenger() {
      return qRampStore().getIsPassenger();
    },
    steppers() {
      let stepps = [
        {
          ref: 'flight',
          title: 'Flight',
          icon: 'fa-regular fa-plane',
          step: STEP_FLIGHT,
          form: this.flight,
          component: iFlight,
        },
        {
          ref: 'services',
          title: 'Services',
          icon: 'fa-regular fa-briefcase-blank',
          step: STEP_SERVICE,
          component: serviceList,
        },
        {
          ref: 'remark',
          title: 'Remark',
          icon: 'fa-regular fa-comment-dots',
          step: STEP_REMARKS,
          form: this.remark,
          component: iRemarks,
        },
        {
          ref: "signature",
          title: this.$tr('ifly.cms.label.signature'),
          icon: 'fa-solid fa-pen-line',
          step: STEP_SIGNATURE,
          form: this.signature,
          component: iSignature,
        }
      ].filter(item => !this.isPassenger ? item : item.step !== STEP_SIGNATURE);
      if (this.isPassenger) {
        const delay = {
          ref: "delay",
          title: "Delay",
          icon: 'fa-light fa-clock',
          step: 8,
          component: delayComponent,
        };
        stepps.splice(2, 0, delay);
      }
      return stepps;
    },
    nextLabel() {
      return this.sp === this.steppers.length ? 'Save to Draft' : this.$tr('isite.cms.label.next')
    },
    loadingComputed() {
      return qRampStore().getLoading();
    },
    actions() {
      if (!qRampStore().getIsblank()) {
        return this.modalProps.update ? this.actionsStepperButtom : this.actionSimpleWorkOrder;
      }
      return [];
    },
    actionSimpleWorkOrder() {
      return [
        {
          props: {
            vIf: !this.modalProps.update,
            color: 'primary',
            label: this.$tr('isite.cms.label.save'),
          },
          action: async () => {
            await this.setLoading(true);
            await this.$refs.simpleWorkOrder.saveSimpleWorkOrder();
            await this.setLoading(false);
          }
        },
      ]
    },
    editPermissionseSubmitted() {
      return qRampStore().editPermissionseSubmitted();
    },
    actionsStepperButtom() {
      const statusId = qRampStore().getStatusId();
      const parentId = storeFlight().getForm().parentId
      const flight = qRampStore().getClonedWorkOrder()
      const showOpenSourceWorkOrder = Boolean(parentId)

      const actions = [
        {
          props: {
            vIf: this.$hasAccess('ramp.work-orders.destroy'),
            class: 'btn-action-form-orders',
            label: this.$q.screen.lt.sm ? null : this.$tr('isite.cms.label.delete'),
            icon: 'fa-regular fa-trash',
            loading: this.loadingComputed,
          },
          action: async () => {
            const route = 'apiRoutes.qramp.workOrders';
            await cacheOffline.deleteItem(this.modalProps.workOrderId, route)
            try {
              await this.$crud.delete(route, this.modalProps.workOrderId, {
                data: {
                  attributes: {
                    id: this.modalProps.workOrderId,
                    titleOffline: 'Delete Work Order'
                  }
                }
              });

            } catch (e) {
              console.error(e)
            }
            await this.getWorkOrders();
            this.clear()
            this.$emit('refresh-data')
            await qRampStore().hideLoading();
          }
        },
        {
          props: {
            vIf: !showOpenSourceWorkOrder && Boolean(flight),
            class: 'btn-action-form-orders',
            label: this.$q.screen.lt.sm ? null : 'Return to cloned work order',
            icon: 'fa-regular fa-arrow-left',
          },
          action: async() => {
            this.loadChildData();
          }
        },
        {
          props: {
            icon: 'fa-brands fa-sourcetree',
            class: 'btn-action-form-orders',
            label: this.$q.screen.lt.sm ? null : 'Open source work order',
            vIf: showOpenSourceWorkOrder,
            loading: this.loadingComputed,
          },
          action: async () => {
            await this.loadParentData();
          }
        },
        {
          props: {
            icon: 'fa-regular fa-floppy-disk',
            class: 'btn-action-form-orders',
            label: this.$q.screen.lt.sm ? null : 'Save to Draft',
            vIf: statusId == STATUS_DRAFT || statusId == STATUS_CLOSED || statusId == STATUS_SCHEDULE,
            loading: this.loadingComputed,
          },
          action: async () => {
            qRampStore().setStatusId(STATUS_DRAFT);
            await this.$refs.stepper.setData();
            setTimeout(async () => {
              const formData = await this.$refs.stepper.sendInfo();
              await this.getWorkOrders(formData);
            }, 1000);
            if (!this.isAppOffline) {
              await workOrderList().getWorkOrderConditionally(true);
            };
            qRampStore().hideLoading()
          }
        },
        {
          props: {
            color: 'white',
            icon: 'fal fa-check',
            'text-color': 'positive',
            label: 'Close',
            vIf: statusId == STATUS_DRAFT || statusId == STATUS_CLOSED || statusId == STATUS_SCHEDULE,
            loading: this.loadingComputed,
          },
          action: async () => {
            await qRampStore().setStatusId(STATUS_CLOSED);
            await this.$refs.stepper.setData();
            setTimeout(async () => {
              const formData = await this.$refs.stepper?.sendInfo();
              await this.getWorkOrders(formData);
            }, 1000);
            if (!this.isAppOffline) {
              await workOrderList().getWorkOrderConditionally(true);
            }
            qRampStore().hideLoading()
          }
        },
        {
          props: {
            color: 'primary',
            'icon-right': 'fa-thin fa-floppy-disk',
            label: this.$tr('isite.cms.label.save'),
            vIf: statusId == null || statusId == STATUS_POSTED || (statusId == STATUS_SUBMITTED && this.editPermissionseSubmitted),
            loading: this.loadingComputed,
          },
          action: async () => {
            await this.$refs.stepper.setData();
            const data = this.$store.state.qrampApp;
            await qRampStore().setStatusId(data.form.statusId);
            await this.$refs.stepper.sendInfo();
            await qRampStore().setStatusId(null);
            if (!this.isAppOffline) {
              workOrderList().getWorkOrderConditionally(true);
            }
            qRampStore().hideLoading()
          }
        },
        {
          props: {
            vIf: this.sp > 1,
            color: 'white',
            'text-color': 'primary',
            class: 'tw-text-xs',
            icon: 'fas fa-arrow-left',
          },
          action: () => {
            this.$refs.stepper.previous()
          }
        },
        {
          props: {
            vIf: this.sp !== this.steppers.length,
            'text-color': 'white',
            color: 'primary',
            'icon-right': 'fas fa-arrow-right',
            class: 'tw-text-xs',
          },
          action: () => {
            this.$refs.stepper.next()
          }
        },
      ];
      return actions;
    }
  },
  methods: {
    /**
     * Close the modal and emit an event to refresh data.
     *
     * @param {boolean} show - Whether to show the modal.
     * @returns {void} Nothing.
     */
    close(show) {
      this.show = show
      this.$emit('refresh-data')
      this.services = [];
      serviceListStore().setShowFavourite(false)
      serviceListStore().setErrorList([]);
      qRampStore().setClonedWorkOrder(null)
      storeFlight().reset()
      signatureStore.resetStore()
    },
    setSignature(data) {
      signatureStore.form = {
        customerSignature: data.customerSignature,
        customerName: data.customerName,
        customerTitle: data.customerTitle,
        representativeSignature: data.representativeSignature,
        representativeName: data.representativeName,
        representativeTitle: data.representativeTitle,
      }
    },
    /**
     * Loads the form asynchronously with the given parameters.
     *
     * @async
     * @param {Object} params - The parameters to be loaded in the form.
     * @throws {Error} An error if loading fails.
     * @returns {void} Nothing.
     */
    async loadform(params) {
      try {
        const updateData = this.$clone(params)
        this.show = true

        /* Chip to identify non-flight work order */
        const type = Number(updateData.data?.type)
        const isNonFlight = type === NON_FLIGHT
        const chip = {
          label: "Non-flight",
        }
        this.modalProps = updateData.modalProps
        if (this.isPassenger) {
          if(isNonFlight && this.modalProps.update) this.modalProps.chip = { ...chip }
        }

        console.log('this.modalProps', this.modalProps)

        this.flight = {}
        this.remark = {}
        this.signature = {}
        this.statusId = STATUS_DRAFT
        this.needToBePosted = false
        qRampStore().setWorkOrderItems([]);
        qRampStore().setStatusId(this.statusId);
        qRampStore().setNeedToBePosted(this.needToBePosted);
        if (!updateData.data) return
        this.setSignature(updateData.data)
        qRampStore().setTypeWorkOrder(updateData.data?.type || null);
        this.statusId = updateData.data['statusId'] ? updateData.data['statusId'].toString() : '1';
        this.needToBePosted = updateData.data['needToBePosted'] || false;
        qRampStore().setStatusId(this.statusId);
        qRampStore().setNeedToBePosted(this.needToBePosted);
        storeFlight().setForm(updateData.data);
        this.flight = storeFlight().getForm();
        qRampStore().setResponsible(updateData.data['responsible']);
        cargoStore().setForm(updateData.data);
        cargoStore().setDelayList(updateData.data);
        cargoStore().setDelayComment(updateData.data.delayComment || null)
        cargoStore().setOurDelay(updateData.data.ourDelay || null);
        if(navigator.onLine) {
          qRampStore().setWorkOrderItems(updateData.data['workOrderItems']);
        } else {
          const workOrderItems = workOrderList().getWorkOrdersItemsList()?.filter(
            item => item.workorderId == this.modalProps.workOrderId
          );
          const updatedItems = updateData.data['workOrderItems']?.length > 0
            ? updateData.data['workOrderItems']
            : workOrderItems;
          qRampStore().setWorkOrderItems(updatedItems);
        }

        await serviceListStore().init();
        remarksStore().setForm(updateData.data);
        this.signature.customerName = updateData.data['customerName']
        this.signature.customerTitle = updateData.data['customerTitle']
        this.signature.representativeName = updateData.data['representativeName']
        this.signature.representativeTitle = updateData.data['representativeTitle']
        this.signature.customerSignature = updateData.data['customerSignature']
        this.signature.representativeSignature = updateData.data['representativeSignature']
        this.$store.commit('qrampApp/SET_FORM_FLIGHT', this.flight);
        this.$store.commit('qrampApp/SET_FORM_SIGNATURE', this.signature)
        qRampStore().hideLoading();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        qRampStore().hideLoading();
        console.log(error);
      }
    },
    /**
     * Clear the modal properties and form data.
     *
     * @returns {void} Nothing.
     */
    clear() {
      this.modalProps = {}
      this.show = false
      this.services = [];
      cargoStore().reset();
      remarksStore().reset();
      serviceListStore().setShowFavourite(false)
      serviceListStore().setErrorList([]);
      qRampStore().setClonedWorkOrder(null)
      storeFlight().reset()
      signatureStore.resetStore()
    },
    /**
     * Set the loading state of the modal.
     *
     * @param {boolean} value - Whether to show the loading state.
     * @returns {void} Nothing.
     */
    setLoading(value) {
      this.loading = value;
    },
    async getWorkOrders(data = null) {
      this.$emit('getWorkOrderFilter', data);
    },
    async loadChildData() {
      this.loading = true;
      this.resetFormModalFull()
      const flight = qRampStore().getClonedWorkOrder()
      storeFlight().setForm({ ...flight })
      await workOrderList().getFavourites()

      const modalProps = {
        ...modalFullProps,
        title: this.modalProps.lastTitle,
        workOrderId: flight.id,
        isClone: true
      }

      this.loadform({ data: flight, modalProps })
    },
    async loadParentData() {
      this.loading = true;
      const data = JSON.parse(JSON.stringify(this.$store.state.qrampApp));
      const formData = structuredClone(await constructionWorkOrder(data))
      qRampStore().setClonedWorkOrder(formData)

      this.resetFormModalFull();
      const workOrder = await getWorkOrder(formData?.parentId)
      workOrder.data.parentId = null
      storeFlight().setForm({ ...workOrder.data })
      await workOrderList().getFavourites()

      const modalProps = {
        ...modalFullProps,
        title: this.$tr('ifly.cms.form.updateWorkOrder') + (workOrder.data.id ? ` Id: ${workOrder.data.id}` : ''),
        lastTitle: this.modalProps.title,
        workOrderId: workOrder.data.id,
        chip: {
          label: "Parent",
        },
        parent: true
      }

      this.loadform({ data: workOrder.data, modalProps })
    },
    resetFormModalFull() {
      serviceListStore().setShowFavourite(false)
      serviceListStore().setErrorList([]);
      serviceListStore().resetStore();
      cargoStore().reset();
      remarksStore().reset();
      this.$refs.stepper.sp = STEP_FLIGHT;
    }
  },
}
</script>
<style>
.btn-action-form-orders {
  @apply tw-bg-gray-200 sm:tw-bg-transparent;
  color: #4C5D94;
}

.q-btn__wrapper {
  padding: 4px 12px;
}

.master-dialog__actions .q-btn .q-icon {
  font-size: 16px;
}

#formRampComponent .boundColor {
  background-color: #F1F4FA;
}
</style>
