import { computed, ComputedRef } from 'vue';
import { OPERATION_TYPE_NON_FLIGHT, SECURITY } from '../../model/constants.js'
import qRampStore from '../../../_store/qRampStore.js'
import workOrderList from '../../../_store/actions/workOrderList'
import store from '../store/modalSchedule.store'
import kanbanStore from '../store/kanban.store'
import { i18n } from 'src/plugins/utils'

export default function modelFields() {
    const isPassenger = computed(() =>  qRampStore().getIsPassenger());
    const isBlank = computed(() => kanbanStore.isBlank);
    const form = computed(() => store.form)
    const filterGates = computed(() => {
        return workOrderList()
          .getGatesList()
          .filter(item => {
            return Number(item.stationId) === Number(store.stationId)
          })
          .map(item =>
            ({
              value: item.id,
              label: item.name
            }));
    });

    const filterStation = computed(() => {
      return workOrderList()
        .getStationList()
        .map(
          item => ({
            label: item.stationName,
            value: item.id
          })
        )
    })

    const filterAcType = computed(() => {
      return workOrderList()
        .getACTypesList()
        .map(
          item => ({
            label: item.model,
            value: item.id
          })
        )
    })

    const flightStatusesList = computed(() => workOrderList().getFlightStatusesList().map((item) =>({
        label: item.name,
        id: item.id,
        color: item.color,
        value: item.id,
    })))
    const flightStatus = computed(() => flightStatusesList.value.find(item => item.id == form.value.flightStatusId) || null);

    const operationTypeList =  computed(() => {
      const data = structuredClone(workOrderList().getOperationTypeList())
      if (OPERATION_TYPE_NON_FLIGHT.includes(Number(form.value.operationTypeId))) return data
      if (isPassenger.value) return data.filter(item => !OPERATION_TYPE_NON_FLIGHT.includes(Number(item.id)))
      return data
    });
    const fields: ComputedRef<any> = computed(() => ({
        form: {
            inboundFlightNumber: {
              name:'inboundFlightNumber',
              value: '',
              type: 'input',
              props: {
                readonly: isBlank.value,
                rules: [
                  val => !!val || i18n.tr('isite.cms.message.fieldRequired')
                ],
                label: `*${i18n.tr('ifly.cms.form.flight')}`,
                clearable: true,
                color:"primary"
              },
            },
            stationId: {
              name:'stationId',
              value: store.stationId,
              type: 'select',
              props: {
                readonly: isBlank.value,
                rules: [
                  val => !!val || i18n.tr('isite.cms.message.fieldRequired')
                ],
                label: `*${i18n.tr('ifly.cms.form.station')}`,
                clearable: true,
                color:"primary",
                options: filterStation.value
              },
            },
            gateId: {
              name:'gateId',
              value: null,
              type: 'select',
              props: {
                vIf: !isPassenger.value && qRampStore().getTypeWorkOrder() !== SECURITY,
                readonly: isBlank.value,
                label: `${i18n.tr('ifly.cms.form.gate')}`,
                clearable: true,
                color:"primary",
                options: filterGates.value
              }
            },
            operationTypeId: {
              name:'operationTypeId',
              value: '',
              type: 'select',
              props: {
                rules: [
                  val => !!val || i18n.tr('isite.cms.message.fieldRequired')
                ],
                label: `*${i18n.tr('ifly.cms.form.operation')}`,
                clearable: true,
                color:"primary",
                'hide-bottom-space': false,
                options: operationTypeList.value
              }
            },
            sta: {
              value: null,
              type: 'hour',
              props: {
                rules: [
                  val => !!val || i18n.tr('isite.cms.message.fieldRequired')
                ],
                readonly: isBlank.value,
                label: 'STA',
                format24h: true,
              },
            },
            outboundScheduledDeparture: {
              value: null,
              type: 'fullDate',
              props: {
                rules: [
                  val => !!val || i18n.tr('isite.cms.message.fieldRequired')
                ],
                mask:'MM/DD/YYYY HH:mm',
                hint:'Format: MM/DD/YYYY HH:mm',
                readonly: isBlank.value,
                label: 'STD',
                format24h: true,
              },
            },
            flightStatusId: {
              value: null,
              type: 'select',
              props: {
                readonly: isBlank.value,
                selectColor: true,
                colorType: 'tailwindcss',
                label: `Flight Status`,
                clearable: true,
                color:"primary",
                options: flightStatusesList.value,
              },
            },
            acTypeId: {
              value: null,
              type: 'select',
              props: {
                label: i18n.tr('ifly.cms.sidebar.aircraftType'),
                options: filterAcType.value,
              },
            },
          },
    }));

    return {
        fields,
        flightStatusesList,
        flightStatus,
    }
}
