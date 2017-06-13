import $ from 'jquery'

function global (store) {
  $(window).keydown((event) => {
    // 윈도우면 control 맥이면 command
    var cmd = (store.state.conf.platform.isDarwin ? event.metaKey : event.ctrlKey)

    // cmd + s : save sheet
    if (cmd && event.which === 83) store.dispatch('saveSheet')
    // cmd + o : open sheet
    else if (cmd && event.which === 79) store.dispatch('openSheet')
    // cmd + n
    // else if (cmd && event.which === 78) { }
    // cmd + i : inspector toggle
    else if (cmd && event.which === 73) store.commit('viewToggle', 'inspector')
    // cmd + b : browser toggle
    // else if (cmd && event.which === 66) store.commit('viewToggle')
    // cmd + t : timeline toggle
    else if (cmd && event.which === 84) store.commit('viewToggle', 'timeline')
    // cmd + ,
    else if (cmd && event.which === 188) store.state.settings.flags.show = true

    // F5 : play toggle
    else if (event.which === 116) store.dispatch('playToggleClick')
    // esc : off air
    else if (event.which === 27 && store.state.output.isPlaying) {
      store.dispatch('playOff')
    }
  })
}

export default global
