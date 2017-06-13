export default {
  state: {
    settings: {
      flags: {
        headerIcon: 'ion-android-settings',
        headerLabel: '',
        show: false
      }
    }
  },
  getters: {
    settingsFlags (state) {
      var flags = state.settings.flags
      flags.headerLabel = state.lang[state.conf.lang].settings.headerLabel
      return flags
    }
  },
  mutations: {},
  actions: {}
}
