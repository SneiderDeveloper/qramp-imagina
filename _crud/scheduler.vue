<template>
  <div>
    <schedulerModal @refreshData="getDataTable(true)" />
    <crud :crud-data="import('./baseCrud.vue')" :custom-data="crudData" ref="crudComponent"
          :title="$route.meta.title" />
  </div>
</template>
<script>
import workOrderList from '../_store/actions/workOrderList.ts'
import schedulerStore from '../_components/scheduler/store/index.store.ts'
import schedulerModal from '../_components/scheduler/index.vue';
import show from '../_components/scheduler/actions/show.ts';
import {
  BUSINESS_UNIT_RAMP,
  BUSINESS_UNIT_CARGO,
  BUSINESS_UNIT_PASSENGER,
  LABOR,
  BUSINESS_UNIT_LABOR, BUSINESS_UNIT_SECURITY, CARGO_PAX
} from "../_components/model/constants"
import qRampStore from '../_store/qRampStore.js'
import { cache } from 'src/plugins/utils'

export default {
  components: {
    schedulerModal,
  },
  data() {
    return {
      crudId: this.$uid(),
      token: '',
      path: '',
      routes: {
        [BUSINESS_UNIT_RAMP]: 'ramp-module',
        [BUSINESS_UNIT_PASSENGER]: 'passenger-module',
        [BUSINESS_UNIT_SECURITY]: 'security-module',
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.token = await this.getToken()
      this.path = this.routes[qRampStore().getBusinessUnitId() || 0]
    })
  },
  beforeMount() {
    this.$nextTick(async () => {
      const urlSchedule = localStorage.getItem("urlSchedule");
      if (urlSchedule.includes('/ramp')) {
        await qRampStore().setIsPassenger(false);
        qRampStore().setBusinessUnitId(BUSINESS_UNIT_RAMP);
      } else if (urlSchedule.includes('/passenger')) {
        await qRampStore().setIsPassenger(true)
        qRampStore().setBusinessUnitId(BUSINESS_UNIT_PASSENGER);
      } else if (urlSchedule.includes('/labor')) {
        await qRampStore().setIsPassenger(true)
        await qRampStore().setTypeWorkOrder(LABOR)
        qRampStore().setBusinessUnitId(BUSINESS_UNIT_LABOR);
      } else if (urlSchedule.includes('/security')) {
        await qRampStore().setIsPassenger(false);
        qRampStore().setBusinessUnitId(BUSINESS_UNIT_SECURITY);
      } else if (urlSchedule.includes('/cargo')) {
        await qRampStore().setIsPassenger(false);
        qRampStore().setBusinessUnitId(BUSINESS_UNIT_CARGO);
        qRampStore().setTypeWorkOrder(CARGO_PAX);
      }
      await workOrderList().getAllList();
    })
  },
  computed: {
    filterBusinessUnit() {
      return qRampStore().getBusinessUnitId();
    },
    isPassenger() {
      return qRampStore().getIsPassenger();
    },
    filterCompany() {
      return qRampStore().getFilterCompany();
    },
    crudData() {
      return {
        crudId: this.crudId,
        //entityName: config("main.qfly.entityNames.workOrder"),
        apiRoute: 'apiRoutes.qramp.schedulers',
        permission: 'ramp.schedulers',
        create: {
          method: async () => {
            schedulerStore.updateModal = false;
            schedulerStore.titleModal = 'New Scheduler'
            schedulerStore.showModal = true;
          }
        },
        extraActions: [{
          label: 'Back to schedule',
          props: {
            icon: 'fa-light fa-calendar-plus',
            label: 'Back to schedule',
          },
          action: () => {
            this.getUrlSchedule()
          }
        }],
        read: {
          help: {
            title: 'Scheduler',
            description: `
              Need help? Check the 
              <a 
                href='https://delightful-ground-0eae6c50f.4.azurestaticapps.net/docs/documentation/${this.path}/schedule#scheduler?token=${this.token}' 
                target='_blank'
                class='tw-text-blue-500'>
                  documentation
              </a>
              for more information on using the Scheduler and its features.
            `,
          },
          columns: [
            {
              name: 'id',
              label: this.$tr('isite.cms.form.id'),
              field: 'id',
              style: 'width: 50px',
            },
            {
              name: 'customerId',
              label: this.$tr('isite.cms.label.customer'),
              field: 'customerId',
              formatAsync: async item => {
                if (!item.customerId) return '-';
                const response = await workOrderList().getCustomerList()
                  .find(customer => customer.id === item.customerId) || {};
                return `${response.customerName || '-'}`;
              },
              align: 'left',
            },
            {
              name: 'flightNumber',
              label: 'Flight Number',
              field: 'flightNumber',
              format: (val) => (val ? val : "-"),
              align: 'left',
            },
            {
              name: 'carrier',
              label: 'Carrier',
              field: 'carrierId',
              formatAsync: async item => {
                if (!item.carrierId) return '-';
                const response = await workOrderList().getAirlinesList()
                  .find(carrier => carrier.id === item.carrierId) || {};
                return `${response.airlineName || '-'}`;
              },
              align: 'left',
            },
            {
              name: 'operationType',
              label: 'Operation Type',
              field: 'operationTypeId',
              formatAsync: async item => {
                const response = await workOrderList().getOperationTypeList()
                  .find(operation => operation.id === item.operationTypeId) || {};
                return `${response.operationName || '-'}`;
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
              name: 'acTypeId',
              label: 'acType',
              field: 'acTypeId',
              formatAsync: async item => {
                if (!item.acTypeId) return '-';
                const response = await workOrderList().getACTypesList()
                  .find(act => act.id === item.acTypeId) || {};
                return `${response.fullName || '-'}`;
              },
              align: 'left'
            },
            {
              name: "fromDate",
              label: 'From Date',
              field: "fromDate",
              align: "left",
              format: (val) => (val ? this.$trdT(val) : "-"),
              sortable: true
            },
            {
              name: "untilDate",
              label: 'Until Date',
              field: "untilDate",
              align: "left",
              format: (val) => (val ? this.$trdT(val) : "-"),
              sortable: true
            },
            {
              name: "inboundScheduledArrival",
              label: 'Arrival',
              field: "inboundScheduleArrival",
              align: "left",
              format: (val) => (val ? this.$trdT(val) : "-"),
              sortable: true
            },
            {
              name: "outboundScheduleDeparture",
              label: 'Departure',
              field: "outboundScheduleDeparture",
              align: "left",
              format: (val) => (val ? this.$trdT(val) : "-"),
              sortable: true
            },
            {
              name: "outboundFlightNumber",
              label: 'Outbound Flight Number',
              field: item => `${item.outboundFlightNumber ? item.outboundFlightNumber : ''}`,
              align: "left",
              format: item => item ? item : '',
            },
            {
              name: "daysOfWeek",
              label: 'Days Of Week',
              field: 'daysOfWeek',
              align: "left",
              format: item => item ? this.convertNumbersToDays(item) : '',
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
            stationId: {
              value: null,
              type: "select",
              props: {
                label: "Station",
                clearable: true,
              },
              loadOptions: {
                delayed: () => new Promise(resolve => {
                  const lists = workOrderList().getStationList().map(item => ({
                    label: item.fullName,
                    value: item.id
                  }))
                  resolve(lists)
                }),
              },
            },
            carrierId: {
              value: null,
              type: 'select',
              props: {
                vIf: false,
                label: 'Carrier',
                clearable: true,
              },
              loadOptions: {
                delayed: () => new Promise(resolve => {
                  const lists = workOrderList().getAirlinesList().map(item => ({
                    label: item.airlineName,
                    value: item.id
                  }))
                  resolve(lists)
                }),
              },
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
                    companyId: this.filterCompany,
                  },
                },
              },
              props: {
                label: 'Customer',
                'clearable': true
              },
            },
            acTypeId: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('ifly.cms.sidebar.aircraftType'),
                clearable: true,
              },
              loadOptions: {
                delayed: () => new Promise(resolve => {
                  const lists = workOrderList().getACTypesList().map(item => ({
                    label: item.model,
                    value: item.id
                  }))
                  resolve(lists)
                }),
              },
            },
            operationTypeId: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('ifly.cms.form.operation'),
                clearable: true,
                color: "primary",
                'hide-bottom-space': false,
              },
              loadOptions: {
                delayed: () => new Promise(resolve => {
                  const lists = workOrderList().getOperationTypeList().map(item => ({
                    label: item.operationName,
                    value: item.id
                  }))
                  resolve(lists)
                }),
              },
              label: this.$tr('ifly.cms.form.operation'),
            },
          },
          actions: [
            {
              name: 'edit',
              icon: 'fal fa-pen',
              label: this.$tr('isite.cms.label.edit'),
              action: async (item) => {
                await show(item.id);
              }
            },
          ],
          requestParams: {
            filter: {
              withoutDefaultInclude: true,
              ...(this.filterBusinessUnit === 'null' ? {}: {businessUnitId:this.filterBusinessUnit}),
              stationCompanies: this.filterCompany,
              ...(qRampStore().getTypeWorkOrder() === CARGO_PAX) ? {type: CARGO_PAX} : {}
            },
          }
        },
        update: true,
        delete: true,
        formLeft: {},
        formRight: {}
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {
    convertNumbersToDays(numbersDays) {
      if (!Array.isArray(numbersDays)) {
        return '';
      }
      const daysOfWeek = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday"
      };

      const namesOfDays = numbersDays.map(number => daysOfWeek[number]);

      return namesOfDays.join(', ');
    },
    getUrlSchedule() {
      const url = localStorage.getItem('urlSchedule');
      window.location.href = url;
    },
    async getDataTable(refresh) {
      await this.$refs.crudComponent.getDataTable(refresh);
    },
    async getToken() {
      try {
        const sessionData = await cache.get.item('sessionData')
        return sessionData.userToken.split(' ')[1]
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss"></style>
