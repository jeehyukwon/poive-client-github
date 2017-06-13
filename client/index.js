import './promise-polyfill'
import { vue } from './vue'

// Enable progressive web app support (with offline-plugin)
if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}

vue.$mount('#index')
