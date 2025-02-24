import { HoursFilter } from '../contracts/hourFilter.contract'
const hoursFilter: HoursFilter[] = [
    {
        label: 'All Day',
        value: '0-23'
    },
    {
        label: '00:00 am - 03:00 am',
        value: '0-2'
    },
    {
        label: '03:00 am - 07:00 am',
        value: '3-6'
    },
    {
        label: '07:00 am - 10:00 am',
        value: '7-9'
    },
    {
        label: '10:00 am - 01:00 pm',
        value: '10-12'
    },
    {
        label: '01:00pm - 04:00 pm',
        value: '13-15'
    },
    {
        label: '04:00 pm - 07:00 pm',
        value: '16-18'
    },
    {
        label: '07:00 pm - 10:00 pm',
        value: '19-21'
    },
    {
        label: '10:00 pm - 12:00 am',
        value: '22-23'
    },
];

export default hoursFilter;