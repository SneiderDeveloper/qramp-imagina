<template>
    <div
      :class="{
        'expandible-ramp-ctn': expandible
      }">
      <q-expansion-item
        v-model="expandible"
        header-class="
          text-primary
          tw-rounded-t-md
          tw-text-base
          boundColor
          tw-p-2
          text-center
          text-weight-bold
          tw-mb-4"
      >
        <template v-slot:header>
          <div class="tw-w-full">
            <p>
              {{ title }}
            </p>
            <div>
              <p>Flight Number: {{ flightNumber }}</p>
              <div>
                <p
                  :class="{
                    'tw-text-green-500': isComplete,
                    'tw-text-orange-500': !isComplete
                  }"
                >
                <i
                  class="fa-solid fa-circle"
                />
                  {{ titleCompleted }}
                </p>
              </div>
            </div>
          </div>
	      </template>
        <div>
          <slot />
        </div>
      </q-expansion-item>
    </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onBeforeUnmount,
  onMounted
} from 'vue'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: () => '',
    },
    flightNumber: {
      type: String,
      default: () => {}
    },
    isComplete: {
      type: Boolean,
      default: () => false,
    },
  },
  setup (props) {
    const expandible = ref<boolean>(false);
    const flightNumber = computed((): string => props.flightNumber);
    const isComplete = computed(() => {
      return props.isComplete;
    });
    const titleCompleted = computed((): string  => isComplete.value ? 'Completed' : 'Not completed');
    onMounted(() => {
      expandible.value = !props.isComplete
    })
    onBeforeUnmount(() => {
      expandible.value = false;
    })
    return {
      expandible,
      flightNumber,
      isComplete,
      titleCompleted,
    }
  }
})
</script>

<style>
.expandible-ramp-ctn .q-expansion-item {
  @apply tw-border tw-border-gray-100 tw-rounded-t-md;
}
</style>
