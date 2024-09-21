<template>
  <div>
    <form-orders ref="formOrders" @refresh-data="getDataTable(true)" />
    <flightDetail />
    <inner-loading :visible="loadingBulk" />
    <crud :crud-data="import('./baseCrud.vue')" :custom-data="crudData" ref="crudComponent"
          :title="$route.meta.title" />
  </div>
</template>
<script>
import formOrders from "../_components/formOrders.vue"
import {
  STATUS_POSTED,
  STATUS_SUBMITTED,
  STATUS_CLOSED,
  STATUS_DRAFT,
  STATUS_SCHEDULE,
  BUSINESS_UNIT_LABOR,
  COMPANY_PASSENGER,
  LABOR, BUSINESS_UNIT_PASSENGER
} from "../_components/model/constants"
import qRampStore from '../_store/qRampStore.js'
import flightDetail from '../_components/modal/flightDetail.vue';
import workOrderList from '../_store/actions/workOrderList.ts';
import { cacheOffline } from 'src/plugins/utils';
import { getWorkOrderAndOpenModal } from '../_store/actions/getWorkOrderAndOpenModal'

export default {
  name: 'RampCrud',
  components: {
    formOrders,
    flightDetail,
  },
  data() {
    return {
      crudId: this.$uid(),
      areaId: null,
      loadingBulk: false,
    }
  },
  provide() {
    return {
      showWorkOrder: this.showWorkOrder,
      openModal: true,
    }
  },
  watch: {
    '$filter.values': {
      deep: true,
      handler: function (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue))
          this.areaId = this.$filter.values.areaId;
      }
    },
    'isAppOffline': {
      deep: true,
      handler: async function (newValue) {
        if (!newValue) {
          await workOrderList().getWorkOrderConditionally(true);
        }
      }
    }
  },
  async created() {
    this.$nextTick(async () => {
      await qRampStore().setIsPassenger(true);
      await qRampStore().setTypeWorkOrder(LABOR);
      qRampStore().setBusinessUnitId(BUSINESS_UNIT_LABOR);
      await workOrderList().getAllList();
      await workOrderList().getCustomerWithContract()
    })
  },
  beforeDestroy() {
    qRampStore().setFlightList([]);
    qRampStore().setFlightId(null);
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    filter() {
      console.log(this.$filter);
      return this.$filter;
    },
    editPermissionseSubmitted() {
      return qRampStore().editPermissionseSubmitted();
    },
    validateStatus() {
      return statusId =>
        statusId == STATUS_DRAFT
        || statusId == STATUS_CLOSED
        || statusId == STATUS_POSTED
        || statusId == STATUS_SCHEDULE
        || (statusId == STATUS_SUBMITTED
          && this.editPermissionseSubmitted)
    },
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qramp.entityNames.workOrders"),
        apiRoute: 'apiRoutes.qramp.workOrders',
        permission: 'ramp.labor-work-orders',
        create: {
          method: async () => {
            await qRampStore().setTitleOffline(this.$tr('ifly.cms.form.newWorkOrder'));
            await qRampStore().setIsPassenger(true);
            this.$refs.formOrders.loadform({
              modalProps: {
                title: this.$tr('ifly.cms.form.newWorkOrder'),
                update: false,
                width: '35vw'
              }
            })
          },
        },
        read: {
          columns: [
            {
              name: 'id',
              label: this.$tr('isite.cms.form.id'),
              field: 'id',
              style: 'width: 50px',
              action: async (item) => {
                await this.showWorkOrder(item)
              }
            },
            {
              name: 'customer',
              label: this.$tr('isite.cms.label.customer'),
              field: item => item.customCustomerName || item.customer,
              formatAsync: async item => {
                const response = await workOrderList().getCustomerList()
                  .find(customer => customer.id === item.customerId) || {};
                return `${response.customerName || '-'}`;
              },
              align: 'left'
            },
            {
              name: 'contract',
              label: 'Contracts',
              field: 'contract',
              format: val => val ? val.contractName : '-',
              align: 'left'
            },
            {
              name: "flightStatus",
              label: 'Flight Status',
              field: "flightStatus",
              align: "left",
              formatColumn: row => {
                const response = workOrderList().getFlightStatusesList()
                  .find(flightStatus => flightStatus.id === row.flightStatusId) || {};
                return {
                  bgTextColor: response && response.color ? `tw-bg-${response.color}` : ''
                }
              },
              formatAsync: async item => {
                const response = await workOrderList().getFlightStatusesList()
                  .find(flightStatus => flightStatus.id === item.flightStatusId) || {};
                return `${response.name || '-'}`;
              },
            },
            {
              name: "inboundFlightNumber",
              label: 'Inbound Flight Number',
              field: item => `${item.inboundFlightNumber ? item.inboundFlightNumber : ''}${item.faFlightId ? '' : '(Manually)'}`,
              align: "left",
              format: item => item ? `<span class="tw-border tw-p-1 tw-rounded-md tw-font-medium"/>${item}</span>` : '',
              action: (item) => {
                const flightNumberInbound = item.faFlightId ? item.faFlightId.split('-')[0] : null;
                const workOrder = {
                  workOrderId: item.id,
                  faFlightId: item.faFlightId,
                  flightNumber: flightNumberInbound || item.inboundFlightNumber,
                  boundScheduleDate: item.inboundScheduleArrival || this.$moment().format('YYYY-MM-DDTHH:mm:ss'),
                  type: 'inbound',
                }
                this.getFlightMap(workOrder)
              }
            },
            {
              name: "inboundScheduledArrival",
              label: 'Arrival',
              field: "inboundScheduledArrival",
              align: "left",
              format: (val) => (val ? this.$trdT(val) : "-"),
              sortable: true
            },
            {
              name: "outboundFlightNumber",
              label: 'Outbound Flight Number',
              field: item => `${item.outboundFlightNumber ? item.outboundFlightNumber : ''}${item.outboundFaFlightId ? '': '(Manually)'}`,
              align: "left",
              format: item => item ? `<span class="tw-border tw-p-1 tw-rounded-md tw-font-medium"/>${item}</span>` : '',
              action: (item) => {
                const flightNumberoutbound = item.outboundFaFlightId ? item.outboundFaFlightId.split('-')[0] : null;
                const workOrder = {
                  workOrderId: item.id,
                  faFlightId: item.outboundFaFlightId,
                  flightNumber: flightNumberoutbound || item.outboundFlightNumber,
                  boundScheduleDate: item.outboundScheduledDeparture || this.$moment().format('YYYY-MM-DDTHH:mm:ss'),
                  type: 'outbound',
                }
                this.getFlightMap(workOrder)
              }
            },
            {
              name: "outboundScheduledDeparture",
              label: 'Departure',
              field: "outboundScheduledDeparture",
              align: "left",
              format: (val) => (val ? this.$trdT(val) : "-"),
              sortable: true
            },
            {
              name: 'adHoc',
              label: 'Ad Hoc',
              field: 'adHoc',
              format: val => val ? 'Yes' : 'No',
              align: 'left'
            },
            {
              name: 'statusName',
              label: this.$tr('isite.cms.form.status'),
              field: 'workOrderStatus',
              formatAsync: async item => {
                const response = await workOrderList().getWorkOrderStatusesList()
                  .find(status => status.id === item.statusId) || {};
                const data = response ? response.statusName + (item.needToBePosted ? "(Posting)" : "") : '-'
                return `${data}`;
              },
              align: 'left'
            },
            {
              name: 'station',
              label: 'Station',
              field: 'stationId',
              formatAsync: async item => {
                if (!item.stationId) return '-';
                const response = await workOrderList().getStationList()
                  .find(station => station.id === item.stationId) || {};
                return `${response.fullName || '-'}`;
              },
              align: 'left'
            },
            {
              name: 'responsible',
              label: 'Responsible',
              field: 'responsible',
              format: val => val ? val.fullName : '-',
              align: 'left'
            },
            {
              name: 'workdayInvoiceId',
              label: 'Workday Invoice Id',
              field: 'workdayInvoiceId',
              format: val => val ? val : '-',
              align: 'left'
            },
            {
              name: "created_at",
              label: this.$tr("isite.cms.form.createdAt"),
              field: "createdAt",
              align: "left",
              format: (val) => (val ? this.$trd(val) : "-"),
            },
            {
              name: "updated_at",
              label: this.$tr("isite.cms.form.updatedAt"),
              field: "updatedAt",
              align: "left",
              format: (val) => (val ? this.$trd(val) : "-"),
            },
            { name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left' },
          ],
          filters: {
            date: {
              props: {
                label: "Scheduled date"
              },
              name: "scheduleDateLocal",
              field: {value: 'schedule_date_local'},
              quickFilter: true
            },
            customerId: {
              value: null,
              type: 'select',
              quickFilter: true,
              loadOptions: {
                apiRoute: 'apiRoutes.qramp.setupCustomers',
                select: { 'label': 'customerName', 'id': 'id' },
                requestParams: {
                  filter: {
                    companyId: COMPANY_PASSENGER,
                  },
                },
              },
              props: {
                label: 'Customer',
                'clearable': true
              },
            },
            contractId: {
              value: null,
              type: 'select',
              quickFilter: true,
              loadOptions: {
                apiRoute: 'apiRoutes.qramp.setupContracts',
                select: { 'label': 'contractName', 'id': 'id' },
                requestParams: {
                  filter: {
                    contractStatusId: 1,
                    businessUnitId: [BUSINESS_UNIT_LABOR, BUSINESS_UNIT_PASSENGER]
                  },
                },
              },
              props: {
                label: 'Contract',
                'clearable': true,
              },
            },
            statusId: {
              value: null,
              type: 'select',
              quickFilter: true,
              loadOptions: {
                apiRoute: 'apiRoutes.qramp.workOrderStatuses',
                select: { 'label': 'statusName', 'id': 'id' },
                requestParams: {
                  filter: {
                    companyId: COMPANY_PASSENGER,
                  },
                },
              },
              props: {
                label: 'Status',
                'clearable': true
              },
            },
            stationId: {
              value: null,
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.qsetupagione.setupStations',
                select: { 'label': 'fullName', 'id': 'id' },
                requestParams: {
                  filter: {
                    companyId: COMPANY_PASSENGER,
                  },
                },
              },
              props: {
                label: 'Station',
                'clearable': true
              },
            },
            adHoc: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                label: 'Ad Hoc',
                clearable: true,
                options: [
                  { label: this.$tr('isite.cms.label.yes'), value: true, },
                  { label: this.$tr('isite.cms.label.no'), value: false, },
                ],
              },
            },
            businessUnitId: { value: [BUSINESS_UNIT_LABOR, BUSINESS_UNIT_PASSENGER] },
          },
          requestParams: {
            include: 'responsible,contract,customer',
            filter: {
              withoutDefaultInclude: true,
              businessUnitId: [BUSINESS_UNIT_LABOR, BUSINESS_UNIT_PASSENGER],
              type: [LABOR]
            },
          },
          actions: [
            {
              name: 'edit',
              icon: 'fal fa-pen',
              format: item => ({
                label: this.validateStatus(item.statusId) ? this.$tr('isite.cms.label.edit') : this.$tr('isite.cms.label.show'),
                icon: this.validateStatus(item.statusId) ? 'fal fa-pen' : 'fal fa-eye',
              }),
              action: async (item) => {
                await this.showWorkOrder(item)
              }
            },
            {
              name: 'close',
              icon: 'fal fa-check',
              label: this.$tr('isite.cms.label.closeFlight'),
              format: item => ({
                //must have the submit permission and the work order can't be submited or posted
                vIf: ![STATUS_POSTED, STATUS_SUBMITTED, STATUS_CLOSED].includes(item.statusId)
              }),
              action: (item) => {
                this.changeStatus(STATUS_CLOSED, item.id)
              },
            },
            {
              name: 'submit',
              icon: 'fal fa-check-double',
              label: this.$tr('isite.cms.label.submit'),
              format: item => ({
                //must have the submit permission and the work order can't be submited or posted
                vIf: this.$hasAccess('ramp.work-orders.submit') && ![STATUS_POSTED, STATUS_SUBMITTED].includes(item.statusId)
              }),
              action: (item) => {
                this.changeStatus(STATUS_SUBMITTED, item.id)
              },
            },
            {
              name: 'post',
              icon: 'fal fa-paper-plane',
              label: this.$tr('isite.cms.label.post'),
              action: (item) => {
                this.changeStatus(STATUS_POSTED, item.id)
              },
              format: item => (
                {
                  vIf: this.$hasAccess('ramp.work-orders.post') && !item.adHoc && !item.needToBePosted && ![STATUS_POSTED].includes(item.statusId),
                  label: this.$tr('isite.cms.label.post')

                }),
            },
            {
              name: 'repost',
              icon: 'fas fa-paper-plane',
              label: 'Repost',
              action: (item) => {
                this.changeStatus(STATUS_POSTED, item.id)
              },
              format: item => (
                {
                  //must have the specific re-post permission, the work order can't be Ad Hoc and must be un status posted
                  vIf: this.$hasAccess('ramp.work-orders.re-post') && !item.adHoc && item.statusId == STATUS_POSTED
                }),
            },
            {
              name: 'Reload Transactions',
              icon: 'fa-light fa-download',
              label: 'Reload Transactions',
              action: (item) => {
                this.postReloadTransactions(item.id);
              },
              format: item => ({
                vIf: this.$hasAccess('ramp.labor-work-orders.reload-transactions') && !this.isAppOffline
              }),
            },
          ],
          bulkActions: [
            {
              apiRoute: "/ramp/v1/work-orders/bulk-submit",
              permission: "ramp.labor-work-orders.bulk-submit",
              criteria: "id",
              props: {
                icon: "fas fa-check",
                label: "Submit"
              }
            },
            {
              apiRoute: "/ramp/v1/work-orders/bulk-export-pdf",
              permission: "ramp.labor-work-orders.bulk-export-pdf",
              criteria: "id",
              props: {
                icon: "fas fa-download",
                label: "Print Bulk(PDF)"
              }
            },
            {
              apiRoute: "/ramp/v1/work-orders/passenger-bulk-export-csv",
              permission: "ramp.labor-work-orders.bulk-export-csv",
              criteria: "id",
              props: {
                icon: "fas fa-download",
                label: "Bulk(CSV)"
              }
            },
            {
              apiRoute: "/ramp/v1/work-orders/bulk-reload-transactions",
              permission: "ramp.labor-work-orders.bulk-reload-transactions",
              criteria: "id",
              props: {
                icon: "fas fa-download",
                label: "Reload Transactions"
              }
            }
          ],
          relation: {
            permission: "ramp.labor-work-orders.see-workday-transactions",
            apiRoute: 'apiRoutes.qramp.workOrderTransactions',
            requestParams: (row) => {
              return {
                filter: { workOrderId: row.id },
                include: 'product,contractLine'
              }
            },
            columns: [
              {
                name: 'productId',
                label: 'Sale Item Id',
                field: 'product',
                format: val => val?.externalId || '-'
              },
              {
                name: 'productName',
                label: 'Sale Item Name',
                field: 'product',
                format: val => val?.name || '-'
              },
              {
                name: 'contractLineWorkdayId',
                label: 'Contract LI Id',
                field: 'contractLine',
                format: val => val?.contractLineWorkdayId || '-'
              },
              {
                name: 'invoiceLineMemo',
                label: 'Invoice Line Memo',
                field: 'contractLine',
                format: val => val?.InvoiceLineMemo || '-'
              },
              {
                name: 'quantity',
                label: 'Quantity',
                field: 'quantity'
              },
              {
                name: 'rate',
                label: 'Rate',
                field: 'contractLine',
                format: val => val?.rate || '-'
              },
              {
                label: 'Total',
                field: val => {
                  const quantity = val.quantity || 0;
                  const rate = val.contractLine?.rate || 0;
                  return quantity * rate;
                }
              },
              {
                name: 'transactionId',
                label: 'Transaction Id',
                field: 'transactionId'
              },
              {
                name: 'postedAt',
                label: 'Date Posted',
                field: 'postedAt',
                format: (val) => (val ? this.$trdT(val) : "-"),
              },
              {
                name: 'amount',
                label: 'ammount',
                field: 'ammount'
              }
            ]
          }
        },
        update: true,
        delete: true,
        formLeft: {}
      }
    },

    getCustomerName() {
      return (item) => {
        let customerName = item;
        if (item) {
          customerName = typeof item === 'object' ? item.customerName : item;
        }
        return customerName || '-';
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {
    async postReloadTransactions(id) {
      try {
        this.loadingBulk = true;
        await this.$crud.update('apiRoutes.qramp.reloadTransactions', id, {});
        await this.$root.$emit('crud.data.refresh');
        this.loadingBulk = false;
      } catch (error) {
        this.loadingBulk = false;
      }
    },
    getOfflineTitleStatus(statusId, itemId) {
      const statusObj = {
        1: 'DRAFT',
        2: 'POSTED',
        3: 'SUBMITTED',
        4: 'CLOSED',
        5: 'SCHEDULE',
      }
      return `Work Order ${statusObj[statusId]} - ID ${itemId}`;
    },
    async changeStatus(status, itemId) {
      const API_ROUTE = 'apiRoutes.qramp.workOrderChangeStatus';
      const CACHE_PATH = 'apiRoutes.qramp.workOrders'

      const payload = {
        id: itemId,
        statusId: status
      }
      let customParams = {
        params: {
          titleOffline: this.getOfflineTitleStatus(status, itemId) || ''
        }
      }

      this.$emit('loading', true)

      payload.offline = this.isAppOffline;
      await cacheOffline.updateRecord(CACHE_PATH, payload, payload?.id);

      const request = this.$crud.update(
        API_ROUTE,
        itemId,
        payload,
        customParams
      )
      request
        .catch(err => {
          this.$emit('loading', false)
          if (!this.isAppOffline) {
            this.$alert.error({
              message: `${this.$tr('isite.cms.message.recordNoUpdated')}`
            })
          }
        })
        .finally(() => {
          this.$emit('loading', false)
          this.$root.$emit('crud.data.refresh')
        })
    },
    async showWorkOrder(data, modalProps={}, makeRequest=true) {
      await getWorkOrderAndOpenModal(this.$refs.formOrders, data, modalProps, makeRequest)
    },
    async getFlightMap(workOrder) {
      try {
        qRampStore().setWorkOrder(workOrder);
        qRampStore().showVisibleMapModal();
      } catch (error) {
        qRampStore().setWorkOrder(null);
        console.log(error);
      }
    },
    async getDataTable(refresh) {
      await this.$refs.crudComponent.getDataTable(refresh);
    },
  }
}
</script>
<style lang="stylus">
</style>
