import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'

import Index from './components/Index'

sync(store, router)

const vue = new Vue({
  router,
  store,
  ...Index
})

export { vue, router, store }
