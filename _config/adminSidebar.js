const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'ifly.cms.sidebar.rampInfo',
    icon: 'fa-light fa-arrows-up-down-left-right',
    children: [
      pages.qramp.workOrders,
      pages.qramp.flightMap,
      pages.qramp.schedule,
      pages.qramp.workOrderStatuses
    ]
  },
  {
    title: 'isite.cms.message.request',
    icon: 'fa-light fa-browser',
    children: [
      pages.qramp.oagStations
    ]
  },
  
]
