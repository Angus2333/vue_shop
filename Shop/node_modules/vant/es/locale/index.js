import { ref, reactive } from 'vue';
import { deepAssign } from '../utils/deep-assign';
import defaultMessages from './lang/zh-CN';
var lang = ref('zh-CN');

var _messages = reactive({
  'zh-CN': defaultMessages
});

export default {
  messages: function messages() {
    return _messages[lang.value];
  },
  use: function use(newLang, newMessages) {
    var _this$add;

    lang.value = newLang;
    this.add((_this$add = {}, _this$add[newLang] = newMessages, _this$add));
  },
  add: function add(newMessages) {
    if (newMessages === void 0) {
      newMessages = {};
    }

    deepAssign(_messages, newMessages);
  }
};