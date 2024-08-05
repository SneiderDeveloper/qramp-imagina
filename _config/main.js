import { cache } from 'src/plugins/cache'

export default {
  moduleName: 'flight',
  //Entities
  entityNames: {
    aircraftType: 'aircraftType',
    airline: 'airline',
    flightSchedule: 'flightSchedule',
    flightScheduleLeg: 'flightScheduleLeg',
    airlport: 'airlport',
    flight: 'flights',
    workOrders: 'workOrders'
  },
  quickCards: [
    {
      active: true,
      permission: 'ramp.dashboard.work-orders-by-status-lines',
      component: () => import('../_components/quick-cards/lineChart.vue')
    },
    {
      active: true,
      permission: 'ramp.billing-closed-date.edit',
      component: () => import('../_components/quick-cards/billingClosedDate')
    },
    {
      active: true,
      permission: 'ramp.dashboard.work-orders-by-status',
      component: () => import('../_components/quick-cards/bar.vue')
    },
    {
      active: true,
      permission: 'ramp.dashboard.percentage-work-orders-posted',
      component: () => import('../_components/quick-cards/percentage.vue')
    }
  ],
  lists: async () => {
    const workOrderList = await import('../_store/actions/workOrderList.ts')
    const STORAGE_KEY = 'apiRoutes.qramp.workOrders::offline'
    await cache.set(STORAGE_KEY, { data: [] });
    await workOrderList.default().getAllList(true)
  },
  refresh: async () => {
    const buildKanbanStructure = await import('../_components/scheduleKanban/actions/buildKanbanStructure.ts')
    const workOrderList = await import('../_store/actions/workOrderList.ts')

    await buildKanbanStructure?.default(true)
    await workOrderList.default().getWorkOrderConditionally(true)
  },
}
