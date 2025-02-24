import { computed } from 'vue';
import { i18n } from 'src/plugins/utils'

export default function modalSchedule() {
      const fields = computed(() => ({
        airportId: {
          value: null,
          type: "select",
          props: {
            label: "Airport *",
            rules: [
              (val) => !!val || i18n.tr("isite.cms.message.fieldRequired"),
            ],
            clearable: true,
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfly.airports',
            select: { label: 'fullName', id: 'id' },
          }
        },
        airlineId: {
          value: null,
          type: "select",
          props: {
            label: "Airline *",
            rules: [
              (val) => !!val || i18n.tr("isite.cms.message.fieldRequired"),
            ],
            clearable: true,
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qfly.airlines',
            select: {
              label:'airlineName',
              id: 'id'
            },
          }
        },
        startDate: {
          value: null,
          type: "date",
          props: {
            label: "Start Date *",
            rules: [
              (val) => !!val || i18n.tr("isite.cms.message.fieldRequired"),
            ],
            clearable: true,
          },
        },
        dateRange: {
          value: null,
          type: "select",
          props: {
            label: "Date range *",
            rules: [
              (val) => !!val || i18n.tr("isite.cms.message.fieldRequired"),
            ],
            clearable: true,
            options: [
              { label: "7 days", value: "sevenDays" },
              { label: "30 days", value: "thirtyDays" },
              { label: "60 days", value: "sixtyDays" },
              { label: "90 days", value: "ninetyDays" },
            ]
          },
        },
        separationHours: {
          value: null,
          type: "input",
          props: {
            label: "Separation Hours",
            clearable: true,
            type: "number",
          },
        }
    }))

    return {
      fields,
    }
}
