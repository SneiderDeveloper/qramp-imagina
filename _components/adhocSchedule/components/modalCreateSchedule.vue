<template>
    <master-modal
      v-model="showModalCreateSchedule"
      title="New schedule"
      @hide="handleCloseModal"
      :actions="actions"
      :maximized="$q.screen.lt.md"
    >
      <q-form v-if="!loading" ref="refModalStation">
        <dynamic-field 
          v-for="(field, key) in fields" 
          :field="field" 
          v-model="scheduleForm[key]" 
        />
      </q-form>
      <modalLoading v-if="loading"/>
    </master-modal>
  </template>
<script lang="ts">
import { defineComponent } from "vue";
import useModalCreateSchedule from '../uses/useModalCreateSchedule.ts'
import modalLoading from "./modalLoading.vue";

export default defineComponent({
  components: {
    modalLoading
  },
  setup () {
    return {...useModalCreateSchedule()}
  }
})
</script>
<style scoped>

</style>