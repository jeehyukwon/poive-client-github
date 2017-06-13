import { ipcRenderer } from 'electron'

function ipcInit (store) {
  // IPC Listener
  ipcRenderer.on('sendIndexBack', (event, arg) => {
    store.dispatch('play', {
      groupNum: arg.groupNum,
      sceneNum: arg.sceneNum,
      slideNum: arg.slideNum,
      sended: true
    })
  })
  ipcRenderer.on('outputClosed', () => {
    store.state.output.isPlaying = false
  })
}

export default ipcInit
