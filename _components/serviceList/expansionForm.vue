<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import serviceListStore from './store/serviceList';
import postFavourites from './services/postFavourites'
import deleteFavourites from './services/deleteFavourites'
import workOrderList from '../../_store/actions/workOrderList';
import storeFlight from '../flight/store';
import { alert, store } from 'src/plugins/utils';

export default defineComponent({
  name: 'expansionComponent',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const data: any = computed(() => props.data);
    const isDesktop = computed(() => (window as any).innerWidth >= '900');
    const isAppOffline = computed(() => store.state.qofflineMaster.isAppOffline)
    const permissionFavourite: any = computed(() => ({
      create: store.hasAccess('isite.favourites.create'),
      edit: store.hasAccess('isite.favourites.edit'),
      index: store.hasAccess(`isite.favourites.index`),
      destroy: store.hasAccess(`isite.favourites.destroy`),
    }));
    async function selectFavourite(data: any) {
      data.favourite = !data.favourite;
      if (!data.favourite) {
        if(!permissionFavourite.value.destroy) return;
        const favoriteData = serviceListStore().getFavouriteList().find(item => item.productId === data.id);
        await deleteFavourites(favoriteData?.id);
        serviceListStore().removeFromFavouriteList(data.id);
        alert.success({ message: `Favorite deleted successfully Product:${data.title}` });
      } else {
        if(!permissionFavourite.value.create) return;
        const { stationId, contractId, customerId, carrierId, operationTypeId } = storeFlight().getForm();
        const response: any = await postFavourites({
          productId: data.id,
          stationId,
          contractId,
          customerId,
          carrierId,
          operationTypeId
        });
        serviceListStore().pustFavouriteList({ ...response });
        alert.success(`Favorite created successfully Product:${data.title}`);
      }
      await workOrderList().getFavourites(true);
    }
    const favourite = ref(false);
    const refData = ref({});
    function showValue(data: any) {
      if (data) {
        return data.value
      }
    }

    return {
      isDesktop,
      showValue,
      data,
      favourite,
      selectFavourite,
      refData,
      permissionFavourite,
      isAppOffline
    }
  },
})
</script>
<template>
  <div id="expansion-container" class="tw-mb-12" style="max-width: 100%">
    <div v-if="!isDesktop">
      <q-list v-for="(item, index) in data" :key="index">
        <q-expansion-item header-class="text-white">
          <template v-slot:header>
            <q-item-section v-if="permissionFavourite.create" avatar class="q-pr-none " style="min-width: 45px;">
              <i
                  class="fa-star color-icon-star tw-cursor-pointer tw-text-2xl"
                  @click="selectFavourite(data[index])"
                  :class="{
                    'fa-solid': data[index].favourite,
                    'fa-light': !data[index].favourite,
                  }"
              />
            </q-item-section>
            <q-item-section class="q-py-sm">
              <p class="tw-text-base tw-font-bold" style="color:#1F294F;">
                {{ item.title }}
                <br>
                <span v-if="item.helpText" class="tw-text-xs tw-text-gray-500">
                  {{ item.helpText }}
                </span>
              </p>
              <span class="tw-text-sm" style="color:#8A98C3;">{{ showValue(item.formField.quantity) }}</span>
            </q-item-section>
          </template>
          <q-card class="row card-color justify-center">
            <q-card-section class=" q-py-md col-12 col-md" v-for="(field, keyfield) in item.formField" :key="keyfield">
              <label class="flex no-wrap items-center ">
                <dynamic-field class="marginzero tw-w-full" v-model="data[index]['formField'][keyfield]['value']"
                  :field="field" />
              </label>
              <div class="tw-px-3 tw-font-semibold tw-mt-5 tw-text-center tw-hidden" v-if="field.type === 'fullDate'
      && field.props.typeIndexDate === 1">
                Difference (hours): {{ 1 }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <!-- <q-separator color="red" />-->
      </q-list>
    </div>
    <div v-else>
      <div v-for="(item, index) in data" :key="index" class="
          tw-flex
          color-bg-blue-gray-custom
          tw-py-2
          tw-rounded-lg"
        >
        <div
          class="
            tw-flex
            tw-w-2/5
            tw-break-words
            tw-py-3
            text-services
            tw-pl-2"
          >
              <div class="q-px-sm" v-if="permissionFavourite.create && !isAppOffline">
                <i
                  class="fa-star color-icon-star tw-cursor-pointer"
                  @click="selectFavourite(data[index])"
                  :class="{
                    'fa-solid': data[index].favourite,
                    'fa-light': !data[index].favourite,
                  }"
                />
              </div>
              <div>
                <p>
                  {{ item.title }}
                </p>
                <p
                    v-if="item.helpText"
                    class="tw-text-xs tw-text-gray-500">
                  {{ item.helpText }}
                </p>
              </div>
        </div>
        <div
          class="
            tw-w-3/5
            tw-mx-2
            tw-truncate
            tw-flex
            tw-flex-wrap
            tw-justify-end tw-gap-4"
          >
          <div
            v-for="(field, keyfield) in item.formField"
            :key="keyfield"
          >
            <div>
              <dynamic-field v-model="data[index]['formField'][keyfield]['value']" :field="field" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#expansion-container {
  @apply tw-border tw-border-gray-100 tw-rounded-lg tw-overflow-hidden tw-p-3;
}

#expansion-container .card-color {
  @apply tw-rounded-lg tw-mx-4;
  background-color: #F1F4FA;
}

#expansion-container .q-expansion-item--collapsed {
  @apply tw-relative;
}

#expansion-container .q-expansion-item--collapsed:before {
  content: '';
  @apply tw-bg-gray-200 tw-mx-4 tw-absolute tw-bottom-0 tw-inset-x-0 tw-h-px;
}

.color-bg-blue-gray-custom:hover {
  background: rgba(241, 244, 250, 1);
}

.text-services {
  font-family: Manrope;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  color: rgba(76, 93, 148, 1);
}

.color-icon-star {
  color: rgba(138, 152, 195, 1)
}
</style>
