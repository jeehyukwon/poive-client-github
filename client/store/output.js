const electron = require('electron')
const ipcRenderer = electron.ipcRenderer

export default {
  state: {
    output: {
      isPlaying: false,  // 현재 플레이 중인지...
      isBlack: false,     // 현재 black 상태인지...
      isOutputScreen: false  // 이 창이 output screen 인지
    }
  },
  getters: {},
  mutations: {},
  actions: {
    playOn ({ dispatch, state }) {
      ipcRenderer.send('playOn', { groups: state.sheet.groups, index: state.sheet.playing, isBlack: state.output.isBlack })
      state.output.isPlaying = true
    },
    playOff ({ state }) {
      if (state.output.isPlaying) ipcRenderer.send('playOff', '')
      state.output.isPlaying = false
    },
    playToggle ({ dispatch, state }) {
      // console.log('playToggle')
      if (state.output.isPlaying) dispatch('playOff')
      else dispatch('playOn')
    },
    blackToggle ({ state }) {
      state.output.isBlack = !state.output.isBlack
      if (state.output.isPlaying) {
        ipcRenderer.send('sendBlack', state.output.isBlack)
      }
    }
  }
}
