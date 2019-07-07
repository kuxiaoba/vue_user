import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
// 导入全局样式
import './assets/css/global.css'

Vue.use(Router)
export default new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login }
    ]
})