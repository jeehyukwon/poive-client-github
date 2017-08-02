import electronSettings from 'electron-settings'
import platform from 'electron-platform'
import { ipcRenderer, screen } from 'electron'

import $ from 'jquery'
import resizable from 'jquery-ui/ui/widgets/resizable'

import lang from 'assets/lang.json'

const scale100 = 17

export default {
  state: {
    conf: {
      platform,
      isInstalled: electronSettings.has('poive'),
      // isInstalled: false,
      lang: '',
      scale: 1,
      screens: screen.getAllDisplays(),
      outputDisplay: 0,
      defaultTemplate: 0,
      version: ''
    },
    lang
  },
  getters: {},
  mutations: {
    changeConf (state) {
      electronSettings.set('poive.conf', state.conf)
    },
    changeOutputScreen (state) {
      ipcRenderer.send('changeOutputScreen', state.conf.outputDisplay)
    },
    changeScale (state) {
      document.body.style.fontSize = state.conf.scale * scale100 + 'px'
      state.view.app = false
      setTimeout(() => {
        state.view.app = true
      }, 100)
      resizable({
        handles: 'w',
        minWidth: 300,
        resize (event, ui) {
          ui.element.css('left', 0)
        }
      }, $('#app > .main > .right'))
    }
  },
  actions: {
    initConf ({ commit, dispatch, state }) {
      // console.log('load configs')
      // localStorage에 저장된 conf를 가져온다
      // console.log('[Poive] Loading latest configurations...')
      const conf = electronSettings.get('poive.conf')
      state.conf.lang = conf.lang
      state.conf.scale = conf.scale
      state.conf.defaultTemplate = conf.defaultTemplate
      state.conf.version = conf.version
      // state.conf.platform = conf.platform
      state.conf.outputDisplay = conf.outputDisplay

      const view = electronSettings.get('poive.view')
      state.view = view

      // localStorage에 저장된 templates를 가져온다
      // console.log('[Poive] Loading installed templates...')
      state.templates = electronSettings.get('poive.templates')

      document.body.style.fontSize = state.conf.scale * scale100 + 'px'
    }
  }
}
