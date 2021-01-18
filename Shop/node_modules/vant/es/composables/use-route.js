/**
 * Vue Router support
 */
import { getCurrentInstance } from 'vue';
export var routeProps = {
  to: [String, Object],
  url: String,
  replace: Boolean
};
export function route(vm) {
  var router = vm.$router;
  var to = vm.to,
      url = vm.url,
      replace = vm.replace;

  if (to && router) {
    router[replace ? 'replace' : 'push'](to);
  } else if (url) {
    replace ? location.replace(url) : location.href = url;
  }
}
export function useRoute() {
  var vm = getCurrentInstance().proxy;
  return function () {
    route(vm);
  };
}