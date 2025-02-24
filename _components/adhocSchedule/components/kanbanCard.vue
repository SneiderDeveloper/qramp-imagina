<template>
  <div>
    <div class="
      tw-relative
      tw-rounded-lg
      card-h
      tw-my-2
      tw-border-l-8
      showCard
      tw-bg-white" :class="colorCheckSchedule"
      v-if="!card?.editable"
    >
      <div>
        <div class="tw-py-3 tw-pl-2 tw-w-full">
          <div class="tw-flex tw-pb-1">
            <div 
              class="tw-w-10/12 tw-flex tw-cursor-pointer"  
            >
              <i v-if="isNonFlight" class="fa-regular fa-plane-slash tw-mr-2" />
              <p 
                class="
                  text-kanban-card 
                  tw--mt-0.5 
                  tw-cursor-pointer 
                  tw-truncate
                "
              >
                {{ card?.calendar?.title }}
              </p>
            </div>
            <div class="
              tw-flex
              tw-items-center
              tw-space-x-2
              tw-px-3
              tw--mt-2
              tw-text-gray-500
              dot-vertical
              tw-hidden 
              "
              :class="{
                'tw-cursor-move': !isBlank
              }"
              v-if="isWeekAgenda"
            >
              <i class="fa-solid fa-grip-dots-vertical tw-text-lg" />
            </div>
          </div>
          <div class="
            tw-font-semibold
            tw-text-xs
            tw-space-y-1">
            <div class="tw-flex tw-space-x-2 arrival-text">
              <div v-if="card?.calendar?.sta && !card?.calendar?.tos">
                <i class="fa-solid fa-arrow-down-right"></i> STA: {{ card?.calendar?.sta ? moment(card?.calendar?.sta, 'HHmm').format('HH:mm') : '' }}
              </div>
              <div v-if="card?.calendar?.std && !card?.calendar?.tos">
                <i class="fa-solid fa-arrow-up-right"></i> STD: {{ card?.calendar?.std ? moment(card?.calendar?.std,'HHmm').format('HH:mm') : '' }}
              </div>
              <div v-if="card?.calendar?.tos">
                <q-tooltip>Time of Service</q-tooltip>
                TOS: {{ card?.calendar?.tos ? moment(card?.calendar?.tos,'HHmm').format('HH:mm') : '' }}
              </div>
            </div>
            <div class="tw-flex tw-space-x-1">
              <div class="ac-type-text tw-truncate tw-w-28" v-if="actypes">
                <i class="fa-solid fa-plane"></i> A/C#: {{ actypes }}
                <q-tooltip v-if="actypes">
                  {{ actypes }}
                </q-tooltip>
              </div>
              <div class="tw-flex tw-items-center tw-truncate" v-if="gates">
                <img v-if="!isPassenger" src="../svg/p-small.svg" class="tw-pr-1" alt="" srcset="">
                <img v-if="isPassenger" src="../svg/g-small.svg" class="tw-pr-1" alt="" srcset="">
                {{ gates }}
              </div>
            </div>
            <div
              class="
              tw-py-1
              tw-flex
              tw-items-center
              tw-pr-3"
            >
              <span class="tw-uppercase tw-font-extrabold text-status">
                {{ titleStatus }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="flightStatuses"
        class="
          bg-gray-c-100
          tw-absolute
          tw-bottom-0
          tw-left-0
          tw-w-full
          tw-h-7
          tw-py-1
          tw-px-2
          text-x2
          tw-space-x-1
          tw-font-extrabold
          tw-rounded-br-lg
          tw-uppercase
          " :class="flightStatuses.color"

        >
        <div class="tw-cursor-pointer">
          <i :class="flightStatuses.icon" />
          <span class="tw-ml-1">
            {{ flightStatuses.name }}
          </span>
        </div>
      </div>

      <div
       v-if="card.loading"
       class="
        tw-absolute
        tw-inset-0
        tw-bg-opacity-75
        tw-pt-12
        tw-bg-white
        tw-flex
        tw-justify-center"
      >
         <q-spinner color="primary" size="2em" />
      </div>
    </div>
  </div>


</template>

<script lang="ts">
import { defineComponent } from "vue";
import useKanbanCard from '../uses/useKanbanCard'

export default defineComponent({
  props: {
    card: {
      type: Object,
      required: true,
    },
    dateColumn: {
      type: String,
      default: () => null
    },
    isWeekAgenda: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    return {...useKanbanCard(props)}
  },
});
</script>

<style scoped>
.text-x2 {
  font-size: 11px;
}

.card-h {
  height: 125px;
}
.text-kanban-card {
  color: #1F294F;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: 110%; /* 15.4px */
  letter-spacing: 0.7px;
}
.arrival-text {
  color: #1F294F;
  leading-trim: both;
  text-edge: cap;
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 13.2px */
  letter-spacing: 0.36px;
}
.ac-type-text {
  color: #1F294F;
  leading-trim: both;
  text-edge: cap;
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.36px;
}
.text-status {
  color: #1F294F;
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  line-height: 110%; /* 13.2px */
  letter-spacing: 0.36px;
  text-transform: uppercase;
}
.showCard {
  box-shadow: 0px 2px 4px 0px rgba(31, 41, 79, 0.07), 4px 4px 8px 0px rgba(31, 41, 79, 0.14);
}
.bg-gray-c-100 {
  background: rgba(31, 41, 79, 0.07);
}
</style>
