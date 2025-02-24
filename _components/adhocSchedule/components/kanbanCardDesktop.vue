<template>
  <div>
    <!--Desktop-->
    <div class="
          tw-flex tw-flex-row
          tw-rounded-lg
          tw-border-l-8
          tw-my-2
          tw-py-2
          tw-border-blue-400
          tw-bg-white
          items-center
          showCard"
          :class="colorCheckSchedule"
          v-if="!card.editable"
        >
        <div class="
          tw-flex
          tw-items-center
          tw-p-2
          tw-pl-6
          tw-cursor-pointer
          text-kanban-card-desktop"
        >
          <i 
            v-if="isNonFlight" 
            class="fa-regular fa-plane-slash tw-mr-2" 
          />
          <p>{{ card.calendar?.title }}</p>
        </div>
        <div class="
          tw-flex
          tw-mx-6"
        >
          <img src="../svg/slash.svg" alt="" srcset="" class="">
        </div>
        <div class="
          tw-flex
          tw-p-2
          tw-cursor-pointer
          arrival-text-desktop"
        >
          <div v-if="card.calendar.sta && !card.calendar.tos">
            <i class="
              fa-solid
              fa-arrow-down-right
              tw-mr-2"
            />STA: {{ card.calendar.sta ? moment(card.calendar.sta, 'HHmm').format('HH:mm') : '' }}
          </div>
          <div v-if="card.calendar.std && !card.calendar.tos">
            <i class="
              fa-solid
              fa-arrow-up-right
              tw-ml-4
              tw-mr-1"
            />STD: {{ card.calendar.std ? moment(card.calendar.std,'HHmm').format('HH:mm') : '' }}
          </div>
          <div v-if="card.calendar.tos">
            <q-tooltip>Time of Service</q-tooltip>
            TOS: {{ card.calendar.tos ? moment(card.calendar.tos,'HHmm').format('HH:mm') : '' }}
          </div>
        </div>
        <div class="
          tw-flex
          tw-mx-6"
        >
          <img src="../svg/slash.svg" alt="" srcset="" class="">
        </div>
        <div class="
          tw-flex
          tw-cursor-pointer
          ac-type-text-desktop"
        >
          <p>
            <i class="
              fa-solid
              fa-plane
              tw-mr-1"
            />A/C#: {{ actypes }}
          </p>
        </div>
        <div class="
          tw-flex
          tw-mx-6"
          v-if="gates"
        >
          <img src="../svg/slash.svg" alt="" srcset="" class="">
        </div>
        <div class="
          tw-flex
          ac-type-text-desktop"
          v-if="gates"
        >
          <p>
            <div class="tw-flex
              tw-cursor-pointer"
            >
              <img v-if="!isPassenger" src="../svg/p-big.svg" class="tw-pr-1" alt="" srcset="">
              <img v-if="isPassenger" src="../svg/g-big.svg" class="tw-pr-1" alt="" srcset="">
              {{ gates }}
            </div>
          </p>
        </div>
        <div class="
          tw-flex
          tw-mx-6"
        >
          <img src="../svg/slash.svg" alt="" srcset="" class="">
        </div>
        <div class="
          tw-flex
          tw-32
          tw-p-2
          tw-cursor-pointer"
        >
          <div class="
            tw-uppercase
            text-kanban-card-desktop"
          >
            {{ titleStatus }}
          </div>
        </div>
        <div class="
          tw-flex
          tw-mx-6"
          v-if="flightStatuses"
        >
          <img src="../svg/slash.svg" alt="" srcset="" class="">
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
            text-status-desktop
            tw-cursor-pointer"
            @click="openModalSelectFlightNumber"
          >
            <span :class="flightStatuses.color">
              <i class="tw-mr-1" :class="flightStatuses.icon"
              />{{ flightStatuses.name}}
            </span>
          </div>
        </div>
        <div class="
          tw-flex
          tw-mx-6"
          v-if="flightStatuses"
        >
          <img src="../svg/slash.svg" alt="" srcset="" class="">
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
.text-kanban-card-desktop {
  color: rgba(31, 41, 79, 0.80);
  leading-trim: both;
  text-edge: cap;
  font-family: Manrope;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 19.8px */
  letter-spacing: 0.36px;
}
.arrival-text-desktop {
  color: rgba(31, 41, 79, 0.80);
  leading-trim: both;
  text-edge: cap;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 17.6px */
  letter-spacing: 0.32px;
}
.ac-type-text-desktop {
  color: rgba(31, 41, 79, 0.80);
  leading-trim: both;
  text-edge: cap;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 17.6px */
  letter-spacing: 0.32px;
}
.text-status-desktop {
  color: rgba(31, 41, 79, 0.80);
  leading-trim: both;
  text-edge: cap;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 110%; /* 17.6px */
  letter-spacing: 0.32px;
  text-transform: uppercase;
}
</style>
