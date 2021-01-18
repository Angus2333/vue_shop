import { ref, onBeforeUpdate } from 'vue';
export function useRefs() {
  var refs = ref([]);
  onBeforeUpdate(function () {
    refs.value = [];
  });

  var setRefs = function setRefs(index) {
    return function (el) {
      refs.value[index] = el;
    };
  };

  return [refs, setRefs];
}