import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 根据屏幕宽度动态设置rem基准值
import 'amfe-flexible'

// 使用vant  是一个插件，包含了很多组件，称为：组件库
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'

import '@/styles/index.less'

import plugin from '@/utils/plugin'
Vue.use(plugin)

Vue.use(Vant)
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
