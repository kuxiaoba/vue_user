import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'

import axios from 'axios'
// 挂载到vue的原型上,所有vue的组件上都可以通过this访问到这个属性
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //在请求拦截器中给每次发送请求的request添加令牌
axios.interceptors.request.use(function(config) {
    // console.log(config)
    //添加Authorization这个令牌字段
    config.headers.Authorization = sessionStorage.getItem("token");
    //  在最后必须return config
    return config;
})
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')