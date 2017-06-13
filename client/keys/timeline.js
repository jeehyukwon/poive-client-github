import $ from 'jquery'

function timeline (store) {
  $(document).on('keydown', '#timeline', (event) => {
    // 윈도우면 control 맥이면 command
    var cmd = (store.state.conf.platform.isDarwin ? event.metaKey : event.ctrlKey)

    // Command / Control 키를 누른채 함께 할 때
    if (cmd && event.which === 67) { // cmd + c
      store.dispatch('copySlide')
    } else if (cmd && event.which === 86 && store.state.contexts.copiedSlide) { // cmd + v
      store.dispatch('pasteSlide')
    } else if (event.which === 8) { // delete
      if (store.getters.selected.sl !== -1) {
        store.commit('deleteSlide', {
          groupNum: store.getters.selected.groupNum,
          sceneNum: store.getters.selected.sceneNum,
          slideNum: store.getters.selected.slideNum
        })
      }
    } else if (event.which === 37) { // 화살표들
      event.preventDefault()
      store.dispatch('prevSlide')
    } else if (event.which === 38) {
      event.preventDefault()
      store.dispatch('prevSlide')
    } else if (event.which === 39) {
      event.preventDefault()
      store.dispatch('nextSlide')
    } else if (event.which === 40) {
      event.preventDefault()
      store.dispatch('nextSlide')
    }
  })
}

export default timeline

