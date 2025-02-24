import { computed } from 'vue';


export default function filterModel() {
  return computed(() => ({
    order:{"field":"id","way":"desc"},
    type:[1,2,3,4,5],
    withoutDefaultInclude:true,
    typeAgenda: {
      value: null,
    },
    dateStart: {
      value: null,
    },
    dateEnd: {
      value: null,
    },
    referenceId: {
      value: null,
    }
  }));
}
