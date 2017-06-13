<template lang="pug">
li.scene(v-if="sceneFilter(value)", :class="{'selected': $store.getters.selectedScene === value}")
  ul.slides
    draggable(v-model="value.slides", :options="{group:'slide', animation: 300, ghostClass: 'drag-ghost'}")
      li.slide(
        v-for="slide, slIndex in value.slides", :key="slIndex",
        @click="$store.dispatch('select', {groupNum: gIndex, sceneNum:sIndex, slideNum:slIndex})",
        @contextmenu="$store.commit('openContext', {items: [{label: $store.state.lang[$store.state.conf.lang].control.sheet.play, commit: 'play', param: {groupNum: gIndex, sceneNum: sIndex, slideNum: slIndex}}, {divider: true}, {label: $store.state.lang[$store.state.conf.lang].control.sheet.deleteSlide, commit: 'deleteSlide', param: {groupNum: gIndex, sceneNum: sIndex, slideNum: slIndex}}, {divider: true}, {label: $store.state.lang[$store.state.conf.lang].control.sheet.copy, dispatch: 'copySlide', 'param': {groupNum: gIndex, sceneNum: sIndex, slideNum: slIndex}}, {label: $store.state.lang[$store.state.conf.lang].control.sheet.cut, dispatch: 'cutSlide', 'param': {groupNum: gIndex, sceneNum: sIndex, slideNum: slIndex}}, {divider: true}, {disabled: $store.state.contexts.copiedSlide === false ,label: $store.state.lang[$store.state.conf.lang].control.sheet.paste, dispatch: 'pasteSlide', 'param': {groupNum: gIndex, sceneNum: sIndex, slideNum: slIndex}}], event: $event})",
        :class="{'selected': $store.getters.selectedSlide === slide, 'playing': $store.getters.playingSlide === slide, 'now-playing': $store.state.output.isPlaying}"
      )
        .slide-info
          .slide-info-play-button(@click="$store.dispatch('play', {groupNum: gIndex, sceneNum: sIndex, slideNum: slIndex})")
            i.ion-play
        .slide-box
          slide(:slide.sync="slide", :scene.sync="value")
  ul.slides
    li.add-slide(@click="$store.dispatch('addSlideAndSet', {groupNum: gIndex, sceneNum: sIndex})", v-show="!$store.state.view.sheetLock")
      i.ion-plus
      |{{ $store.state.lang[$store.state.conf.lang].control.sheet.addSlide }}
</template>
<script>
import slide from 'components/_slide'
import draggable from 'vuedraggable'

export default {
  props: ['value', 'sIndex', 'gIndex'],
  components: {slide, draggable},
  methods: {
    sceneFilter(scene){
      return (!this.$store.state.sheet.filter) ? true : scene.title.toUpperCase().indexOf(this.$store.state.sheet.filter.toUpperCase()) > -1
    }
  },
  mounted(){
  }
}
</script>

<style scoped>
.drag-ghost {
  opacity: 0;
}
</style>