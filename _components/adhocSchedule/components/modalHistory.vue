<script setup lang="ts">
import store from '../store/kanban.store.ts'
import scheduleListTable from './scheduleListTable.vue';

const openModalCreateSchedule = () => {
    store.showModalHistory = false
    store.showModalCreateSchedule = true
}

</script>
<template>
    <master-modal
        v-model="store.showModalHistory"
        title="History"
        width='max-content'
        custom-position
    >
        <scheduleListTable 
            :initialPagination="{ rowsPerPage: 10 }" 
            @onEmptyTableButtonClick="openModalCreateSchedule"
        />
    </master-modal>
</template>