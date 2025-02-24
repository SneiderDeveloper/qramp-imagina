<template>
  <div 
    class="
     actions-bar 
     sm:tw-flex
     sm:tw-flex-row
     tw-flex-wrap
     tw-items-center 
     tw-pb-4
     tw-text-blue-500
     tw-space-x-2"
  >
    <div class="">
        <q-btn
          v-show="!isWeekAgenda"
          @click="week"
          flat
          outline
          no-caps
          dense
          class="agendaButtons"
        >Week
        </q-btn>
        <span
          v-show="!isWeekAgenda"
          class="
            tw-w-1
            tw-h-4
            tw-mx-1
            tw-border-l-2
            tw-text-xs
            tw-border-grey-200"
        ></span>
        <q-btn
          @click="today"
          flat
          outline
          no-caps
          dense
          class="agendaButtons"
        >Today
      </q-btn>
      <button class="btn-action tw-mx-1" @click="back">
        <i class="fa-regular fa-angle-left"></i>
      </button>
      <button class="btn-action tw-mx-1" @click="next">
        <i class="fa-regular fa-angle-right"></i>
      </button>
    </div>
    <div
      class="
      tw-ml-auto
        tw-items-center 
        tw-text-sm 
        md:tw-text-base
        tw-font-semibold 
        tw-space-x-1 
        tw-cursor-pointer"
        @click="openDrawerFilter"
    >
      <div class="agendaResume">
          {{ titleFilter }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useActionsBar from '../uses/useActionsBar'

export default defineComponent({
  setup(props) {
    return {...useActionsBar(props)};
  },
});
</script>

<style>
.actions-bar .btn-action {
  @apply tw-text-blue-500 tw-rounded-md tw-shadow-sm tw-border tw-w-9 tw-h-9 tw-border-gray-200 tw-font-bold hover:tw-bg-gray-200 hover:tw-text-white;
}

.agendaButtons {
  font-size: 20px !important;
  font-weight: 700;
}

.agendaResume {
  font-size: 14px;
}
</style>
