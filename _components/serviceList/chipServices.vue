<script lang="ts">
import { defineComponent } from 'vue'
import chipServicesController from './controllers/chipServices'

export default defineComponent({
  setup(props, {emit}) {
    return { ...chipServicesController({}, emit) }
  }
})
</script>

<template>
  <div class="tw-flex tw-items-center">
    <q-btn
      icon="fa-regular fa-star"
      :class="`${showFavourite ? 'color-icon-active' : 'color-icon'}`"
      size="sm"
      round
      flat
      @click="favourites"
      v-if="favouritesList.length > 0 && permissionFavourite.index && !isAppOffline"
    >
      <q-badge
        floating
        rounded
        color="primary"
        class="tw-ml-4 tw-px-1 tw--right-0.5"
      >
        {{ favouritesList.length }}
      </q-badge>
    </q-btn>
    <hr
      v-if="favouritesList.length > 0 && lists.length > 0 && !isAppOffline"
      class="tw-h-5 tw-w-0.5 tw-mx-2 hr-bg-color"
    />
    <q-btn
      class="color-icon"
      icon="fa-regular fa-briefcase-blank"
      size="sm"
      round
      flat
      v-if="lists.length > 0"
    >
      <q-badge
        floating
        rounded
        color="primary"
        class="tw-ml-4 tw-px-1 tw--right-1.5"
        v-if="lists.length > 0">
        {{ lists.length }}
      </q-badge>
      <q-popup-proxy
        ref="popupProxyRef"
        content-class="
          popover-w-490
          lg:tw-bg-white
          tw-shadow-2xl
          tw-rounded-2xl
          tw-max-h-72
          lg:tw-overflow-x-hidden
          tw-py-5
          tw-px-2.5"
      >
        <div
          class="
            popover-w-490
            tw-bg-white
            lg:tw-max-w-4xl
            tw-text-xs
            lg:tw-text-base
            tw-max-h-72
            tw-pb-3
            sm:tw-pb-0
          "
          >
          <div class="text-header-chep tw-mt-5 sm:tw-mt-0 tw-mb-4 tw-ml-3.5">
            Chosen Services
          </div>
          <div
            v-for="(list, index) in lists"
            :key="index"
            class="
              tw-grid
              tw-grid-cols-2
              tw-gap-2
              service-syummary
              tw-items-center
              tw-py-1
              hover-color-chep
              text-blue-chep
              tw-rounded-full
              text-chep
              tw-pl-3.5
            "
          >
            <section class="tw-flex tw-w-full">
              <span
                @click="searchProduct(list.product_id)"
                class="
                  tw-cursor-pointer
                  tw-border-gray-200
                  tw-border-r-2
                  tw-pr-2
                  tw-mr-2
                  tw-truncate
                "
              >
                {{ nameProduct(list.product_id) }}
              </span>
              <div class="tw-flex text-color-bag tw-w-3/5">
                <div
                  v-for="(work, indeWork) in list.work_order_item_attributes"
                  :key="indeWork"
                  class="tw-flex tw-overflow-hidden"
                >
                  <span v-if="work.value && indeWork > 0" class="tw-pr-1">,</span>
                  <span v-if="work.value" class="tw-truncate">{{ work.name }}:
                    <span v-if="work.type === 'checkbox'">
                      <i class="fa-solid fa-circle-check tw-text-green-500" />
                    </span>
                    <span v-else class="tw-truncate">
                      {{ work.value }}
                    </span>
                    <q-tooltip>{{ work.value }}</q-tooltip>
                  </span>
                </div>
              </div>
            </section>
            <section class="tw-mr-3.5">
              <i
                class="
                  fa-light
                  fa-circle-xmark
                  tw-text-xs
                  lg:tw-text-base
                  color-icon-close
                  tw-cursor-pointer
                "
                @click="deleteChip(list.product_id)"
              />
            </section>
          </div>
        </div>
      </q-popup-proxy>
      <q-tooltip>
        Service summary
      </q-tooltip>
    </q-btn>
  </div>
</template>

<style scoped>
.popover-w-490 {
 width: 490px;
 border-radius: 16px;
}
.text-color-blue-3 {
  color: #4C5D94
}
.text-blue-chep {
  color: rgba(76, 93, 148, 1)
}
.hover-color-chep:hover {
  background: rgba(241, 244, 250, 1)
}
.text-chep {
  @apply tw-text-xs lg:tw-text-sm !important;
  font-family: Manrope;
  font-weight: 400;
  line-height: 20px;
}
.text-header-chep {
  @apply tw-text-xs lg:tw-text-sm !important;
  font-family: Manrope;
  font-weight: 700;
  line-height: 20px;
  color: rgba(76, 93, 148, 1)
}
.text-color-bag {
  @apply tw-text-xs lg:tw-text-sm !important;
  font-family: Manrope;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(138, 152, 195, 1)
}
.color-icon-close {
  color: rgba(138, 152, 195, 1)
}

.color-icon {
  color: #8A98C3;
}

.color-icon-active {
  color: #3865C2;
}

.hr-bg-color {
  background-color: #D3DAEC;
}

.service-syummary {
  grid-template-columns: minmax(148px, 588px) auto;
}
</style>
