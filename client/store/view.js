export default {
  state: {
    view: {
      app: false,
      menuset: false,
      inspector: false,
      inspectorTab: 0,
      timeline: false,
      cloud: false,
      cloudTab: 0,
      controlScenes: false,
      sheetLock: false
    }
  },
  getters: {},
  mutations: {
    viewToggle (state, s) {
      if (s === 'menuset') {
        state.view.menuset = !state.view.menuset
      } else if (s === 'inspector') {
        state.view.inspector = !state.view.inspector
      } else if (s === 'timeline') {
        state.view.timeline = !state.view.timeline
      } else if (s === 'controlScenes') {
        state.view.controlScenes = !state.view.controlScenes
      } else if (s === 'cloud') {
        state.view.cloud = !state.view.cloud
      }
    }
  },
  actions: {}
}
