import {
  ref,
  computed,
  WritableComputedRef,
  ComputedRef,
  onBeforeUnmount,
  onMounted
} from 'vue';
import storeFueling from '../store/index';
import qRampStore from 'src/modules/qramp/_store/qRampStore';
import { 
  STATUS_CLOSED, 
  STATUS_DRAFT, 
  STATUS_POSTED, 
  STATUS_SCHEDULE, 
  STATUS_SUBMITTED, 
  STEP_FLIGHT, 
  STEP_SERVICE,
  modalFullProps,
} from '../../model/constants';
import updateWorkOrders from '../services/updateWorkOrders';
import stepps from '../models/defaultModels/stepps'
import serviceListStore from '../../serviceList/store/serviceList';
import baseService from "src/modules/qcrud/_services/baseService.js";
import { alert, store, i18n } from 'src/plugins/utils';
import { useQuasar } from 'quasar';
import workOrderList from '../../../_store/actions/workOrderList';
import { constructionWorkOrder } from 'src/modules/qramp/_store/actions/constructionWorkOrder';
import getWorkOrder from 'src/modules/qramp/_components/scheduleKanban/actions/showWorkOrders';

export default function modalFormController(props: any = null, emit: any = null) {
  const $q = useQuasar();
  const refCreateForm: any = ref(null);
  const refStepper: any = ref(null);
  const loading: ComputedRef<boolean> = computed(() => storeFueling.loading);
  const isUpdate = computed(() => storeFueling.isUpdate);
  const titleModal: ComputedRef<string> = computed(() => storeFueling.titleModal);
  const widthModal: ComputedRef<string> = computed(() => storeFueling.widthModal);
  const showModal: WritableComputedRef<boolean> = computed({
    get: () => storeFueling.showModal,
    set: (value: boolean) => {
      storeFueling.showModal = value;
    }
  });
  const actionsCreate = ref([
    {
      props: {
        color: 'primary',
        label: i18n.tr('isite.cms.label.save'),
      },
      action: async () => {
        qRampStore().setTitleOffline('New fueling')
        save()
      }
    },
  ])
  const actions = computed(() => {
    const statusId = storeFueling.form.statusId;
    const parentId = storeFueling.form.parentId;
    const showOpenSourceWorkOrder = Boolean(parentId);
    const flight = qRampStore().getClonedWorkOrder();
    const actionsUpdate = [
      {
        props: {
          vIf: store.hasAccess('ramp.work-orders.destroy'),
          icon: 'fa-regular fa-trash',
          class: 'btn-action-fueling',
          label: $q.screen.lt.sm ? null : i18n.tr('isite.cms.label.delete'),
          loading: storeFueling.loading,
        },
        action: async() => {
          storeFueling.loading = true;
          await baseService.delete('apiRoutes.qramp.workOrders', storeFueling.form.id);
          storeFueling.reset();
          await emit('refresh-data');
          storeFueling.loading = false;
        }
      },
      {
        props: {
          vIf: !showOpenSourceWorkOrder && Boolean(flight),
          class: 'btn-action-form-orders',
          label: $q.screen.lt.sm ? null : 'Return to cloned work order',
          icon: 'fa-regular fa-arrow-left',
        },
        action: async() => {
          loadChildData();
        }
      },
      {
        props: {
          icon: 'fa-brands fa-sourcetree',
          class: 'btn-action-form-orders',
          label: $q.screen.lt.sm ? null : 'Open source work order',
          vIf: showOpenSourceWorkOrder,
          loading: storeFueling.loading,
        },
        action: async () => {
          await loadParentData();
        }
      },
      {
        props: {
          icon: 'fa-regular fa-floppy-disk',
          label: $q.screen.lt.sm ? null : 'Save to Draft',
          class: 'btn-action-fueling',
          vIf: statusId == STATUS_DRAFT || statusId == STATUS_CLOSED || statusId == STATUS_SCHEDULE,
          loading: storeFueling.loading,
        },
        action: async () => {
          storeFueling.changeStatus(STATUS_DRAFT)
          await update();
        }
      },
      {
        props: {
          icon: 'fal fa-check',
          class: 'close-btn-bg-color',
          'text-color': 'positive',
          label: 'Close',
          vIf: statusId == STATUS_DRAFT || statusId == STATUS_CLOSED || statusId == STATUS_SCHEDULE,
          loading: storeFueling.loading,
        },
        action: async () => {
          storeFueling.changeStatus(STATUS_CLOSED)
          await update();
        }
      },
      {
        props: {
          icon: 'fa-thin fa-floppy-disk',
          label: i18n.tr('isite.cms.label.save'),
          class: 'btn-action-fueling',
          vIf: statusId == null || statusId == STATUS_POSTED || (statusId == STATUS_SUBMITTED && qRampStore().editPermissionseSubmitted()),
          loading: storeFueling.loading,
        },
        action: async () => {
          await update();
        }
      },
      {
        props: {
          vIf: storeFueling.step > 1,
          color: 'white',
          'text-color': 'primary',
          icon: 'fas fa-arrow-left',
        },
        action: () => {
          refStepper.value.back();
        }
      },
      {
        props: {
          vIf: storeFueling.step < 3,
          'text-color': 'white',
          style: 'background-color: #3865C2',
          'icon-right': 'fas fa-arrow-right',
        },
        action: () => {
          refStepper.value.next()
        }
      },
    ];
    return isUpdate.value ? actionsUpdate : actionsCreate.value;
  });
  function clear(): void {
    storeFueling.reset();
    serviceListStore().setShowFavourite(false)
    serviceListStore().setErrorList([]);
    if (isUpdate.value) emit('refresh-data');
  }

  function save() {
    refCreateForm.value.$refs.formFueling.
      validate().then(async (success) => {
        if (success) {
          refCreateForm.value.save()
        }
      })
  }
  async function update() {
    const validateFlight = await (storeFueling.refsGlobal as any).refFlight.validate();
    if (!validateFlight) {
      storeFueling.step = STEP_FLIGHT;
      const step: any = stepps.find(item => item.step === STEP_FLIGHT);
      step.error = true;
      alert.error({ message: i18n.tr('isite.cms.message.formInvalid') })
      return;
    }
    const service = await serviceListStore().getServiceItems();
    if (service.length === 0) {
      alert.warning({
        mode: "modal",
        message: 'Surely you want to save the work order without services',
        actions: [
          {
            label: i18n.tr('isite.cms.label.cancel'),
            color: 'grey-8',
            handler: async () => {
              storeFueling.loading = false;
            },
          },
          {
            label: i18n.tr("isite.cms.label.yes"),
            color: "primary",
            handler: async () => {
              await updateService()
            },
          },
        ],
      });
      return;
    }
    const filterList = await serviceListStore().filterServicesListByQuantity();
    if (filterList.length > 0) {
      storeFueling.step = STEP_SERVICE;
      const step: any = stepps.find(item => item.step === STEP_SERVICE);
      step.error = true;
      alert.error({ message: i18n.tr('You have services to correct') })
      return;
    }
    await updateService()
  }
  async function updateService() {
    await updateWorkOrders()
    storeFueling.reset();
    serviceListStore().setShowFavourite(false);
    await emit('refresh-data');
    const message = i18n.tr('isite.cms.message.recordUpdated')
    alert.info({ message })
  }
  async function getDataTable() {
    await emit('refresh-data')
  }
  function loadform({ data, modalProps }) {
    console.log('loadform', { data, modalProps })
    const { isClone, title, update, width } = modalProps
    // if (!data.id) return;
    storeFueling.showModal = true;
    storeFueling.loading = true;
    storeFueling.isUpdate = update;
    storeFueling.titleModal = title;
    // storeFueling.lastTitle = lastTitle;
    storeFueling.widthModal = width;
    storeFueling.isClone = isClone;
    storeFueling.form = data;
    storeFueling.loading = false;
  }
  async function loadChildData() {
    storeFueling.loading = true;
    storeFueling.reset()
    const flight = qRampStore().getClonedWorkOrder()
    storeFueling.form = { ...flight }
    await workOrderList().getFavourites()

    const modalProps = {
      ...modalFullProps,
      // title: modalProps.lastTitle,
      workOrderId: flight.id,
      isClone: true
    }

    loadform({ data: flight, modalProps })
  }
  async function loadParentData() {
    storeFueling.loading = true;
    const data = storeFueling.form;
    const formData = structuredClone(await constructionWorkOrder(data))
    qRampStore().setClonedWorkOrder(formData)

    storeFueling.reset()
    const workOrder = await getWorkOrder(formData?.parentId)
    workOrder.data.parentId = null
    storeFueling.form = { ...workOrder.data }
    await workOrderList().getFavourites()

    const modalProps = {
      // ...modalFullProps,
      title: i18n.tr('ifly.cms.form.updateWorkOrder') + (workOrder.data.id ? ` Id: ${workOrder.data.id}` : ''),
      lastTitle: this.modalProps.title,
      workOrderId: workOrder.data.id,
      chip: {
        label: "Parent",
      },
      parent: true
    }

    loadform({ data: workOrder.data, modalProps })
  }
  onMounted(async () => {
    storeFueling.emitEvent.refreshData = getDataTable();
  })
  onBeforeUnmount(() => {
    storeFueling.reset();
    serviceListStore().setErrorList([]);
    serviceListStore().setShowFavourite(false)
  })
  return {
    showModal,
    clear,
    loading,
    titleModal,
    widthModal,
    actions,
    refCreateForm,
    save,
    isUpdate,
    refStepper,
    getDataTable,
    loadform
  };
}
