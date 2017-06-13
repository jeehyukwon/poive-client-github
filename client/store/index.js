import Vue from 'vue'
import Vuex from 'vuex'

import view from 'store/view'
import templates from 'store/templates'
import sheet from 'store/sheet'
import output from 'store/output'
import conf from 'store/conf'
import context from 'store/context'
import settings from 'store/settings'
import keys from 'store/keys'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: Object.assign(
    view.state,
    templates.state,
    sheet.state,
    output.state,
    conf.state,
    context.state,
    settings.state,
    keys.state
  ),
  getters: Object.assign(
    view.getters,
    templates.getters,
    sheet.getters,
    output.getters,
    conf.getters,
    context.getters,
    settings.getters,
    keys.getters
  ),
  mutations: Object.assign(
    view.mutations,
    templates.mutations,
    sheet.mutations,
    output.mutations,
    conf.mutations,
    context.mutations,
    settings.mutations,
    keys.mutations
  ),
  actions: Object.assign(
    view.actions,
    templates.actions,
    sheet.actions,
    output.actions,
    conf.actions,
    context.actions,
    settings.actions,
    keys.actions
  )
})

export default store
