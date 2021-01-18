import { createVNode as _createVNode } from "vue";
import { useHeight } from './use-height';
export function usePlaceholder(contentRef, bem) {
  var height = useHeight(contentRef);
  return function (renderContent) {
    return _createVNode("div", {
      "class": bem('placeholder'),
      "style": {
        height: height.value ? height.value + "px" : undefined
      }
    }, [renderContent()]);
  };
}