<template lang="pug">
  #app(v-if="$store.state.view.app")
    top
    .main
      .left(v-if="$store.state.view.cloud")
        cloud
      .center
        control
        timeline(v-show="$store.state.view.timeline")
      .right(v-show="$store.state.view.inspector")
        preview
        inspector
    .bottom
    context
    settings(:flags.sync="$store.getters.settingsFlags")
</template>

<script>
import { ipcRenderer } from 'electron'
import { screen } from 'electron'
import { mapState } from 'vuex'
import electronSettings from 'electron-settings'

import $ from 'jquery'
import resizable from 'jquery-ui/ui/widgets/resizable'
import 'jquery-ui/themes/base/core.css'
import 'jquery-ui/themes/base/resizable.css'

import 'scss/index.scss'

import top from 'components/Top'
import control from 'components/Control'
import preview from 'components/Preview'
import inspector from 'components/Inspector'
import timeline from 'components/Timeline'
import settings from 'components/Settings'
import cloud from 'components/Cloud'

import context from 'components/_context'

import addKeyEventListener from 'keys/index'
import addIpcListener from 'ipc/index'

export default {
  components: {
    top,
    control,
    preview,
    inspector,
    timeline,
    context,
    settings,
    cloud
  },
  computed: mapState(['sheet', 'conf', 'view']),
  methods: {},
  watch: {
    'sheet.groups': {
      deep: true,
      handler (groups) {
        if (this.$store.state.output.isPlaying) {
          ipcRenderer.send('sendSheet', groups)
        }
        this.$store.state.sheet.isModified = true
      }
    },
    'view': {
      deep: true,
      handler (view) {
        electronSettings.set('poive.view', view)
      }
    }
  },
  beforeMount () {
    // Configuration Load or Install (when first-time running)
    this.$store.dispatch('initConf')
    this.$store.dispatch('newSheet')
  },
  mounted () {
    // Resizable Inspector
    resizable({
      handles: 'w',
      minWidth: 300,
      resize (event, ui) {
        ui.element.css('left', 0)
      }
    }, $('#app > .main > .right'))

    // Keyboard Listener
    addKeyEventListener(this.$store)
    addIpcListener(this.$store)

    screen.on('display-added', (event) => {
      this.$store.state.conf.screens = screen.getAllDisplays()
    })
    screen.on('display-removed', (event) => {
      this.$store.state.conf.screens = screen.getAllDisplays()
      // 만약 선택된 디스플레이가 전체 리스트 안에 없으면
      if (this.$store.state.conf.outputDisplay >= this.$store.state.conf.screens.length) {
          // 쇼가 진행중이면 멈추고
        if (this.$store.state.output.isPlaying) this.$store.dispatch('playOff')
        // 맨 첫번째로 바꾼다!
        this.$store.state.conf.outputDisplay = 0
        this.$store.commit('changeOutputScreen')
      }
    })
  }
}
</script>
