<template>
  <div>
    <!--Tablet-->
    <div class="
        tw-flex
        tw-flex-row
        tw-rounded-lg
        tw-border-l-8
        tw-my-2
        tw-border-blue-400
        tw-bg-white
        items-center
        showCard"
        :class="colorCheckSchedule"
        v-if="!card.editable"
      >
        <div class="
          tw-flex
          tw-p-2"
        >
          <div
            class="tw-min-w-36
            tw-cursor-pointer"
            @click="openModalSchedule"
          >
            <div class="tw-flex tw-items-center">
              <i v-if="isNonFlight" class="fa-regular fa-plane-slash tw-mr-2" />
              <p class="text-kanban-card-tablet">{{ card.calendar.title }}</p>
            </div>
            <span class="arrival-text-tablet" v-if="card.calendar.sta && !card.calendar.tos">
              <i class="
                fa-solid
                fa-arrow-down-right
                tw-mr-1"
              />STA: {{ card.calendar.sta ? moment(card.calendar.sta, 'HHmm').format('HH:mm') : '' }}
            </span>
            <span class="arrival-text-tablet" v-if="card.calendar.std && !card.calendar.tos">
              <i class="
                fa-solid
                fa-arrow-up-right
                tw-mx-1"
              />STD: {{ card.calendar.std ? moment(card.calendar.std,'HHmm').format('HH:mm') : '' }}
            </span>
            <span class="arrival-text-tablet" v-if="card.calendar.tos">
              <q-tooltip>Time of Service</q-tooltip>
              TOS: {{ card.calendar.tos ? moment(card.calendar.tos,'HHmm').format('HH:mm') : '' }}
            </span>
            <span class="arrival-text-tablet" v-if="card.calendar.tos">
              <q-tooltip>Time of Service</q-tooltip>
              TOS: {{ card.calendar.tos ? $moment(card.calendar.tos,'HHmm').format('HH:mm') : '' }}
            </span>
          </div> 
        </div>
        <div class="
          tw-flex
          tw-36
          tw-p-2
          tw-cursor-pointer"
          @click="openModalSchedule"
        >
          <div class="ac-type-text-tablet">
            <div>
              <i class="
                fa-solid
                fa-plane
                tw-mr-1"
              />A/C#: {{ actypes }}
            </div>
            <div class="tw-flex" v-if="gates">
              <img v-if="!isPassenger" src="../svg/p-small.svg" class="tw-pr-1" alt="" srcset="">
              <img v-if="isPassenger" src="../svg/g-small.svg" class="tw-pr-1" alt="" srcset="">
              {{ gates }}
            </div>
          </div>
        </div>
        <div class="
          tw-flex
          tw-32
          tw-p-2
          tw-cursor-pointer"
          @click="openModalSchedule"
        >
          <div class="
            tw-uppercase
            text-kanban-card-tablet"
          >
            {{ titleStatus }}
          </div>
        </div>
        <div class="
          tw-flex
          tw-32
          tw-p-2"
          v-if="flightStatuses"
        >
          <div class="
            tw-rounded-lg
            tw-border-2
            tw-border-gray-200
            tw-px-2
            tw-py-1
            tw-uppercase
            tw-cursor-pointer
            text-status-tablet"
            @click="openModalSelectFlightNumber"
          >
            <span
              :class="flightStatuses.color"
            >
              <i class="tw-mr-1" :class="flightStatuses.icon"
              />{{ flightStatuses.name}}
            </span>
          </div>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import useKanbanCard from '../uses/useKanbanCard';

export default defineComponent({
  props: {
    card: {
      type: Object,
      required: true,
    },
    dateColumn: {
      type: String,
      default: () => null
    }
  },
  setup(props) {
    return {...useKanbanCard(props)}
  },
});
</script>
<style scoped>
.icons {
  color: #1F294F99
}
.h-200 {
    height: 60vh;
}
.showCard {
  box-shadow: 0px 2px 4px 0px rgba(31, 41, 79, 0.07), 4px 4px 8px 0px rgba(31, 41, 79, 0.14);
}
.text-kanban-card-tablet {
  color: #1F294F;
  font-family: Manrope;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  /*line-height: 100%; /* 15.4px */
  letter-spacing: 0.7px;
}
.arrival-text-tablet {
  color: #1F294F;
  text-edge: cap;
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 13.2px */
  letter-spacing: 0.36px;
}
.ac-type-text-tablet {
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
.text-status-tablet {
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  line-height: 110%; /* 13.2px */
  letter-spacing: 0.36px;
  text-transform: uppercase;
}
</style>
