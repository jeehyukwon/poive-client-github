import { ipcRenderer } from 'electron'

function ipcOutput (store) {
  ipcRenderer.on('sendSheet', (event, arg) => {
    store.commit('updateGroups', arg)
  })
  ipcRenderer.on('sendIndex', (event, arg) => {
    // console.log(arg)
    store.dispatch('play', {
      groupNum: arg.groupNum,
      sceneNum: arg.sceneNum,
      slideNum: arg.slideNum,
      sended: true
    })
  })
  ipcRenderer.on('sendBlack', (event, arg) => {
    store.state.output.isBlack = arg
  })
}

export default ipcOutput
