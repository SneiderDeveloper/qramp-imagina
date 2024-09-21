import { computed, ref, onMounted, watch, reactive } from 'vue'
import qRampStore from '../../../_store/qRampStore';
import workOrderList from '../../../_store/actions/workOrderList';
import momentTimezone from 'moment-timezone';
import storeFueling from '../store/index'
import storeFlight from '../../flight/store'
import serviceListStore from '../../serviceList/store/serviceList'
import { store, i18n, alert } from 'src/plugins/utils';
import { updateFavoriteServicesList } from '../../serviceList/actions/updateFavoriteServicesList';
import { NON_FLIGHT } from '../../model/constants';

export default function flightController() {
  const refFlight: any = ref(null);
  const mainDataFligthaware = ref([])
  const form: any = computed({
    get: () => storeFueling.form,
    set: (value) => {
      storeFueling.form = value;
    }
  });
  const differenceHour = computed(() => qRampStore().getDifferenceInHours(form.value.inboundBlockIn, form.value.outboundBlockOut))
  const loadingBound = ref(false);
  const dialogTable = computed({
    get: () => storeFueling.dialogTable,
    set: (value) => {
      storeFueling.dialogTable = value;
    }
  })
  const dataTable = computed({
    get: () => storeFueling.dataTable,
    set: (value) => {
      storeFueling.dataTable = value;
    }
  })

  const disabledReadonly = computed(() => {
    return qRampStore().disabledReadonly();
  })
  const validateComponentCustomerOffline = computed(() => {
    if(navigator.onLine) {
      return true;
    } else {
      return !storeFueling.loading
    }
  })
  const timezoneAirport = computed(() => {
    const station = workOrderList().getStationList().find(item => item.id == form.value.stationId);
    const airportId = station?.airportId;
    const airport = workOrderList().getAirportsList().find(item => item.id == airportId) || null
    return airport ? momentTimezone.tz(airport.timezone).format("z") : '';
  });
  const readStatus = computed(() => {
    return !store.hasAccess('ramp.work-orders.edit-status') || disabledReadonly.value
  })
  const formFields = computed(() => {
    return {
      flyFormLeft: {
        stationId: {
          name: 'stationId',
          value: '',
          type: 'select',
          props: {
            rules: [
              val => !!val || i18n.tr('isite.cms.message.fieldRequired')
            ],
            selectByDefault: true,
            readonly: disabledReadonly.value,
            label: `*${i18n.tr('ifly.cms.form.station')}`,
            clearable: true,
            color: "primary",
            options: workOrderList()
              .getStationList()
              .map(
                item => ({
                  label: item.fullName,
                  value: item.id
                })
              ),
            suffix: timezoneAirport.value,
          },
        },
        acTypeId: {
          value: null,
          type: 'select',
          props: {
            rules: [
              val => !!val || i18n.tr('isite.cms.message.fieldRequired')
            ],
            readonly: disabledReadonly.value,
            label: `*${i18n.tr('ifly.cms.form.acType')}`,
            clearable: true,
            color: "primary",
            'hide-bottom-space': false,
            options: workOrderList()
              .getACTypesList()
              .map(
                item => ({
                  label: item.model,
                  value: item.id
                })
              )
          },
          label: i18n.tr('ifly.cms.form.acType'),
        },
      },
      flyFormRight: {
        carrierId: {
          value: null,
          type: 'select',
          props: {
            rules: [
              val => !!val || i18n.tr('isite.cms.message.fieldRequired')
            ],
            readonly: disabledReadonly.value,
            label: `*${i18n.tr('ifly.cms.form.carrier')}`,
            clearable: true,
            color: "primary",
            'hide-bottom-space': false,
            options: workOrderList()
              .getAirlinesList()
              .map(
                item => ({
                  label: item.airlineName,
                  value: item.id
                })
              )
          },
          label: i18n.tr('ifly.cms.form.carrier'),
        },
        statusId: {
          name: 'statusId',
          value: 1,
          type: 'select',
          props: {
            vIf: store.hasAccess('ramp.work-orders.edit-status'),
            rules: [
              val => !!val || i18n.tr('isite.cms.message.fieldRequired')
            ],
            readonly: readStatus.value,
            label: `*${i18n.tr('ifly.cms.form.status')}`,
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
          label: i18n.tr('ifly.cms.form.status'),
        },
        /*responsibleId: {
          value: null,
          type: "select",
          props: {
            //vIf: this.manageResponsiblePermissions,
            selectByDefault: true,
            //readonly: this.disabledReadonly,
            label: 'Assigned to',
            clearable: true,
            color: "primary",
            //options: this.isAppOffline ? this.filterResponsible : []
          },
          loadOptions: {
            //apiRoute: this.isAppOffline ? null : "apiRoutes.quser.users",
            //select: { label: "fullName", id: "id" },
            //filterByQuery: !this.isAppOffline,
            //requestParams: { filter: { companyId: this.filterCompany } }
          },
        },*/
      },
      inboundLeft: {
        inboundFlightNumber: {
          value: '',
          type: 'search',
          props: {
            rules: [
              val => !!val || i18n.tr('isite.cms.message.fieldRequired')
            ],
            hint: 'Enter the fight number and press enter or press the search icon',
            loading: loadingBound.value,
            //readonly: this.readonly || this.disabledReadonly || this.loadingState,
            label: `*${i18n.tr('ifly.cms.form.flight')}`,
            clearable: true,
            maxlength: 7,
            color: "primary"
          },
          label: i18n.tr('ifly.cms.form.flight'),
        },
        inboundOriginAirportId: {
          value: '',
          type: 'select',
          props: {
            //readonly: (this.disabledReadonly || this.flightBoundFormStatus.boundOriginAirportId),
            label: `${i18n.tr('ifly.cms.form.origin')}`,
            clearable: true,
            color: "primary",
            //suffix: this.timezoneAirport,
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfly.airports',
            select: { label: 'fullName', id: 'id' },
            //requestParams: { filter: { status: this.refresh, companyId: this.filterCompany } }
          },
          label: i18n.tr('ifly.cms.form.origin'),
        },
        inboundTailNumber: {
          value: '',
          type: 'input',
          props: {
            //readonly: this.disabledReadonly,
            label: `${i18n.tr('ifly.cms.form.tail')}`,
            clearable: true,
            color: "primary"
          },
          label: i18n.tr('ifly.cms.form.tail'),
        },
        inboundScheduledArrival: {
          value: '',
          type: 'fullDate',
          props: {
            rules: [
              val => !!val || i18n.tr('isite.cms.message.fieldRequired')
            ],
            hint: 'Format: MM/DD/YYYY HH:mm',
            mask: 'MM/DD/YYYY HH:mm',
            'place-holder': 'MM/DD/YYYY HH:mm',
            label: `*${i18n.tr('ifly.cms.form.scheduledArrival')}`,
            clearable: true,
            color: "primary",
            format24h: true,
            //suffix: this.timezoneAirport,
          },
          label: i18n.tr('ifly.cms.form.scheduledArrival'),
        },
      },
      outboundRight: {
        outboundFlightNumber: {
          value: '',
          type: 'search',
          props: {
            rules: [
              val => !!val || i18n.tr('isite.cms.message.fieldRequired')
            ],
            hint: 'Enter the fight number and press enter or press the search icon',
            loading: loadingBound.value,
            //readonly:  this.disabledReadonly || this.loadingState,
            label: `*${i18n.tr('ifly.cms.form.flight')}`,
            clearable: true,
            maxlength: 7,
            color: "primary"
          },
        },
        outboundDestinationAirportId: {
          value: '',
          type: 'select',
          props: {
            //readonly:  (this.disabledReadonly || this.flightBoundFormStatus.boundDestinationAirport),
            label: `${i18n.tr('ifly.cms.form.destination')}`,
            clearable: true,
            color: "primary",
            //suffix: this.timezoneAirport,
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfly.airports',
            select: { label: 'fullName', id: 'id' },
            //requestParams: { filter: { status: this.refresh, companyId: this.filterCompany } }
          },
        },
        outboundTailNumber: {
          name: 'outboundTailNumber',
          value: '',
          type: 'input',
          props: {
            //readonly: this.disabledReadonly,
            label:  `${i18n.tr('ifly.cms.form.tail')}`,
            clearable: true,
            color: "primary"
          },
        },
        outboundScheduledDeparture: {
          value: '',
          type: 'fullDate',
          props: {
            rules: [
              val => val => !!val || i18n.tr('isite.cms.message.fieldRequired')
            ],
            hint: 'Format: MM/DD/YYYY HH:mm',
            mask: 'MM/DD/YYYY HH:mm',
            'place-holder': 'MM/DD/YYYY HH:mm',
            label: `*${i18n.tr('ifly.cms.form.scheduledDeparture')}`,
            clearable: true,
            color: "primary",
            format24h: true,
            //suffix: this.timezoneAirport,
          },
        },
      },
      dateBound: {
        inboundBlockIn: {
          value: '',
          type: 'fullDate',
          props: {
            //...this.validateRulesBlock,
            hint: 'Format: MM/DD/YYYY HH:mm',
            mask: 'MM/DD/YYYY HH:mm',
            'place-holder': 'MM/DD/YYYY HH:mm',
            //readonly: this.disabledReadonly,

            label: `*${i18n.tr('ifly.cms.form.blockIn')}`,
            clearable: true,
            color: "primary",
            format24h: true,
            //options: (date, min) => this.validateFutureDateTime(date, min, this.form.inboundBlockIn),
            //suffix: this.timezoneAirport,
          },
        },
        outboundBlockOut: {
          value: '',
          type: 'fullDate',
          props: {
            //...this.validateRulesBlock,
            hint: 'Format: MM/DD/YYYY HH:mm',
            mask: 'MM/DD/YYYY HH:mm',
            'place-holder': 'MM/DD/YYYY HH:mm',
            //readonly: this.disabledReadonly,
            label: `*${i18n.tr('ifly.cms.form.blockOut')}`,
            clearable: true,
            color: "primary",
            format24h: true,
            //options: this.validateDateOutboundBlockOut,
            //suffix: this.timezoneAirport,
          },
        },
      },
    }
  })
  
  const isActualInAndActualOut = computed(() => {
    const isNonFlight = Number(qRampStore().getTypeWorkOrder()) === NON_FLIGHT
    const isParentId = Boolean(storeFueling.form.parentId)
    const showActualInAndActualOut = isNonFlight ? isParentId : true
    return showActualInAndActualOut
  })

  const reFilterFavorites = async (key: string, value) => {
    storeFueling.loading = true;
    storeFlight().setForm({ ...storeFlight().getForm(), [key]: value });
    await workOrderList().getFavourites(true);
    const servicesList = serviceListStore().getServiceList();
    updateFavoriteServicesList(servicesList);
    storeFueling.loading = false;
  }

  const handleChange = async (key, event) => {
    if (form.value[key] == event) return
    if (!event) return

    if (key === 'stationId') await reFilterFavorites(key, event)
    if (key === 'carrierId') await reFilterFavorites(key, event)
  }

  function setDataTable({select, dialog}) {
    dialogTable.value = dialog
    form.value.faFlightId = select.faFlightId || null;
    const selectedFligth = mainDataFligthaware.value.find((item, index) => {
      return index === select.index
    })
    const selectedData = qRampStore().getFormTable(selectedFligth);
    form.value = {
      ...form.value,
      ...selectedData
    }
  }
  async function searchFlightaware(field) {
    if(!['inboundFlightNumber', 'outboundFlightNumber'].includes(field) ) return;
    const search = form.value[field];
    loadingBound.value = true;
    const response = await workOrderList().getFlightawareSearch(search, true);
    mainDataFligthaware.value = response.data;
    responseStatusFligthaware(response, search)
    loadingBound.value = false;
  }

  function responseStatusFligthaware(response, search) {
    {
      dataTable.value = [];
      if (response.status == 200) {
        dataTable.value = qRampStore().getTableListOfFlights(response.data);
        dialogTable.value = true;
      }
      if (response.status == 204) {
        const message = i18n.tr("ifly.cms.label.flightMessage").replace("#file_number", search)
        alert.warning({
          mode: "modal",
          title: i18n.tr("ifly.cms.form.flight"),
          message,
          actions: [
            {label: i18n.tr('isite.cms.label.cancel'), color: 'grey-8'},
            {
              label: i18n.tr("isite.cms.label.yes"),
              color: "primary",
              handler: () => {
                form.value.faFlightId = null;
                qRampStore().showFielFlightBoundFormStatus();
              },
            },
          ],
        });
      }
    }
  }

  function validateBoundComplete(keyForm) {
    const dataForm = [];
    Object.keys(formFields.value[keyForm]).forEach(key => {
      dataForm.push(qRampStore().checkIfDataArrives(form.value[key]))
    });
    return dataForm.every(item => item === true);
  }

  watch(() => form.value.customerId, async (value, oldValue) => {
    if (value != oldValue) {
      reFilterFavorites('customerId', value)
    }
  }, { deep: true })

  onMounted(() => {
    storeFueling.refsGlobal = { refFlight: refFlight.value };
  })
  return {
    formFields,
    form,
    refFlight,
    disabledReadonly,
    handleChange,
    validateComponentCustomerOffline,
    dialogTable,
    setDataTable,
    dataTable,
    searchFlightaware,
    loadingBound,
    validateBoundComplete,
    differenceHour,
    isActualInAndActualOut
  }
}
