<template lang="pug">
#output(v-if="$store.getters.playingSlide")
  slide(v-show="!$store.state.output.isBlack", :slide.sync="$store.getters.playingSlide", :scene.sync="$store.getters.playingScene", output)
</template>
<script>
import {ipcRenderer} from 'electron'

import $ from 'jquery'

import slide from 'components/_slide'

import addKeyEventListener from 'keys/output'
import addIpcListener from 'ipc/output'

export default {
  components: {slide},
  computed: {},
  methods: {},
  mounted(){
    this.$store.state.output.isPlaying = true
    this.$store.state.output.isOutputScreen = true

    addIpcListener(this.$store)
    addKeyEventListener(this.$store)
  }
}
</script>

<style lang="scss">
#output {
  background-color: black;
  width: 100vw;
  height: 100vh;
}
</style>