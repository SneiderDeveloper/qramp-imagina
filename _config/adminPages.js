export default {
  workOrders: {
    permission: 'ramp.work-orders.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/work-orders/index',
    name: 'qramp.admin.workOrders',
    page: () => import('modules/qramp/_crud/workOrders.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.workOrders',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  schedule: {
    permission: 'ramp.work-order-schedules.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/schedule/index',
    name: 'qramp.admin.schedule',
    page: () => import('modules/qramp/_components/scheduleKanban'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  publicSchedule: {
    //permission: 'ramp.work-orders.manage',
    activated: true,
    authenticated: false,
    path: '/ramp/schedule/public/index',
    name: 'qramp.admin.public.schedule',
    page: () => import('modules/qramp/_components/scheduleKanban/indexBlank.vue'),
    layout: () => import('layouts/blank.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  /*scheduleStatus: {
    permission: 'ramp.schedule-statuses.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/schedule-status/index',
    name: 'qramp.admin.scheduleStatus',
    crud: import('../_crud/scheduleStatus.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.scheduleStatus',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },*/
  workOrderStatuses: {
    permission: 'ramp.work-order-statuses.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/schedule-status/index',
    name: 'qramp.admin.workOrderStatuses',
    crud: import('modules/qramp/_crud/workOrderStatuses.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.workOrderStatuses',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  oagStations: {
    //permission: 'isite.logs.manage',
    activated: false,
    path: '/oagStations/index',
    name: 'qsite.admin.oagStations.index',
    crud: import('modules/qramp/_crud/oagStations'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'isite.cms.sidebar.oagStations',
    icon: 'fa-light fa-building-flag',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  },
  passenger: {
    permission: 'ramp.passenger-work-orders.manage',
    activated: true,
    authenticated: true,
    path: '/passenger/work-orders/index',
    name: 'qramp.admin.passenger',
    page: () => import('modules/qramp/_crud/passengers.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.workOrders',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
      bulkActions: true
    }
  },
  passengerSchedule: {
    permission: 'ramp.passenger-work-order-schedules.manage',
    activated: true,
    authenticated: true,
    path: '/passenger/schedule/index',
    name: 'qramp.admin.passengerSchedule',
    page: () => import('modules/qramp/_components/scheduleKanban'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  passengerPublicSchedule: {
    //permission: 'ramp.work-orders.manage',
    activated: true,
    authenticated: false,
    path: '/passenger/schedule/public/index',
    name: 'qramp.admin.public.passengerSchedule',
    page: () => import('modules/qramp/_components/scheduleKanban/indexBlank.vue'),
    layout: () => import('layouts/blank.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  kanbansSchedule: {
    //permission: 'ramp.work-orders.manage',
    activated: true,
    authenticated: false,
    path: '/kanban/schedule/index',
    name: 'qramp.admin.kanbansSchedule',
    page: () => import('modules/qramp/_components/scheduleKanban/index.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  adHocSchedule: {
    activated: true,
    authenticated: false,
    path: '/adhoc/schedule/index',
    name: 'qramp.admin.kanbansSchedule',
    page: () => import('modules/qramp/_components/adhocSchedule/index.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'Adhoc Schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  scheduler: {
    permission: 'ramp.schedulers.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/scheduler/index',
    name: 'qramp.admin.scheduler',
    page: () => import('modules/qramp/_crud/scheduler.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.scheduler',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  categories: {
    permission: 'ramp.categories.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/categories/index',
    name: 'qramp.admin.categories',
    crud: import('modules/qramp/_crud/categories.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Categories',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  services: {
    permission: 'ramp.products.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/products/index',
    name: 'qramp.admin.products',
    crud: import('modules/qramp/_crud/services.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Sales Line Items',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  attributes: {
    permission: 'ramp.attributes.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/attributes/index',
    name: 'qramp.admin.attributes',
    crud: import('modules/qramp/_crud/attributes.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Attributes',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  operationType: {
    permission: 'ramp.operation-types.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/operation-types/index',
    name: 'qramp.admin.passengerOperationTypes',
    crud: import('modules/qramp/_crud/operationTypes.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Operation Types',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  operationTypePassenger: {
    permission: 'ramp.operation-types.manage',
    activated: true,
    authenticated: true,
    path: '/passenger/operation-types/index',
    name: 'qramp.admin.operationTypesPassenger',
    crud: import('modules/qramp/_crud/operationTypesPassenger.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Operation Types',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  fueling: {
    permission: 'ramp.fueling-work-orders.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/fueling/index',
    name: 'qramp.admin.fueling',
    page: () => import('modules/qramp/_crud/fueling.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'Fueling',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  labor: {
    permission: 'ramp.labor-work-orders.manage',
    activated: true,
    authenticated: true,
    path: '/ramp/labor/index',
    name: 'qramp.admin.labor',
    crud: import('modules/qramp/_crud/labor.vue'),
    page: () => import('../_crud/labor.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.workOrders',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  laborSchedule: {
    permission: 'ramp.labor-work-order-schedules.manage',
    activated: true,
    authenticated: true,
    path: '/labor/schedule/index',
    name: 'qramp.admin.laborSchedule',
    page: () => import('modules/qramp/_components/scheduleKanban'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  security: {
    permission: 'ramp.security-work-orders.manage',
    activated: true,
    authenticated: true,
    path: '/security/index',
    name: 'qramp.admin.security',
    crud: import('modules/qramp/_crud/security.vue'),
    page: () => import('modules/qramp/_crud/security.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'Work Orders',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  securitySchedule: {
    permission: 'ramp.security-work-order-schedules.manage',
    activated: true,
    authenticated: true,
    path: '/security/schedule/index',
    name: 'qramp.admin.securitySchedule',
    page: () => import('modules/qramp/_components/scheduleKanban'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.schedule',
    icon: 'fa-thin fa-calendar-days',
    subHeader: {
      refresh: true,
    }
  },
  securityOperationType: {
    permission: 'ramp.operation-types.manage',
    activated: true,
    authenticated: true,
    path: '/security/operation-types/index',
    name: 'qramp.admin.securityOperationTypes',
    crud: import('modules/qramp/_crud/operationTypesSecurity.vue'),
    page: () => import('src/modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Operation Types',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
  paxOperationTypes: {
    permission: 'ramp.pax-operation-types.manage',
    activated: true,
    authenticated: true,
    path: '/passenger/pax-operation-types/index',
    name: 'qramp.admin.paxOperationTypes',
    crud: import('modules/qramp/_crud/paxOperationTypes.vue'),
    page: () => import('src/modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Pax Operation Types',
    icon: 'fa-light fa-briefcase',
    subHeader: {
      refresh: true,
    }
  },
}

