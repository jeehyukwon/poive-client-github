<template lang="pug">
  #timeline(tabindex="2")
    .timeline-wrapper
      ul.groups
        li.group(v-for="group, gIndex in $store.state.sheet.groups")
          .group-title
            i.ion-ios-flag
            |{{ group.title }}
          ul.scenes
            li.scene(v-for="scene, sIndex in group.scenes", :class="{'selected': $store.getters.selectedScene === scene}")
              .scene-title
                i.ion-pricetag
                |{{ scene.title }}
              ul.slides
                draggable(v-model="scene.slides", :options="{group:'slide-timeline', animation: 300, ghostClass: 'drag-ghost'}")
                  li.slide-timeline(
                    v-for="slide, slIndex in scene.slides",
                    @click="$store.dispatch('select', {groupNum: gIndex, sceneNum:sIndex, slideNum:slIndex})",
                    @contextmenu="$store.commit('openContext', {items: [{label: '재생', commit: 'play', param: {groupNum: gIndex, sceneNum: sIndex, slideNum: slIndex}}, {divider: true}, {label: '슬라이드 삭제', commit: 'deleteSlide', param: {groupNum: gIndex, sceneNum: sIndex, slideNum: slIndex}}, {divider: true}, {label: '복사'}, {label: '잘라내기'}], event: $event})",
                    :class="{'selected': $store.getters.selectedSlide === slide, 'playing': $store.getters.playingSlide === slide, 'now-playing': $store.state.output.isPlaying}"
                  )
                    .slide-info
                      .slide-info-play-button(@click="$store.dispatch('play', {groupNum: gIndex, sceneNum: sIndex, slideNum: slIndex})")
                        i.ion-play
                    .slide-box
                      slide(:slide.sync="slide", :scene.sync="scene")
</template>

<script>
import slide from 'components/_slide'
import draggable from 'vuedraggable'

export default {
  components: { slide, draggable }
}
</script>

<style scoped>
.drag-ghost {
  opacity: 0;
}
</style>
