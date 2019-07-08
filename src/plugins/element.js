import Vue from 'vue'
import { Form, FormItem, Message, Input, Button } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
    // 把message挂载到vue实例上
Vue.prototype.$message = Message