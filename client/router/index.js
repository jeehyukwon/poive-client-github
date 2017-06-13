import Vue from 'vue'
import Router from 'vue-router'
import App from 'components/App'
import Output from 'components/Output'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/app',
      component: App
    },
    {
      path: '/output',
      component: Output
    }
  ]
})
