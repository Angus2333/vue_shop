import { useRect } from '@vant/use';
import { ref, onMounted, nextTick } from 'vue';
export var useHeight = function useHeight(element) {
  var height = ref();
  onMounted(function () {
    nextTick(function () {
      height.value = useRect(element).height;
    });
  });
  return height;
};