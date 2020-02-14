import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import LazyLoad from 'vue-lazyload'
import 'normalize.css'
import './assets/styles/style.scss'
import './assets/styles/icon.scss'

FastClick.attach(document.body)
Vue.use(LazyLoad, {
  loading: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573816912462&di=bed753e58f0afb7d9f8f04f186b4d2a0&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fefcd0520bcc4338994f9b9cc4159cacfecd7741e7dfa-207ARp_fw658'
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
