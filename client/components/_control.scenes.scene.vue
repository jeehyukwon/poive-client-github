<template lang="pug">
li.scene(v-if="sceneFilter(scene)", :class="{'selected': $store.getters.selectedScene === scene}")
  .scene-title
    i.ion-pricetag
    input(type="text", v-model="scene.title" @keydown="$event.stopPropagation()")
  .scene-blank(
    @click="$store.dispatch('select', {groupNum: gIndex, sceneNum:sIndex, slideNum:-1})",
    @contextmenu="$store.commit('openContext', {items: [{label: $store.state.lang[$store.state.conf.lang].control.sheet.deleteScene, commit: 'deleteScene', param: {groupNum: gIndex, sceneNum: sIndex}}], event: $event})"
  )
  .scene-edit
    .scene-edit-buttons
      .scene-edit-buttons-play(
        v-show="scene.slides.length != 0",
        :class="{'playing': $store.getters.playingScene === scene}",
        @click="$store.dispatch('play', {groupNum: gIndex, sceneNum: sIndex, slideNum: 0})"
      )
        i.ion-play
      .scene-edit-buttons-play.disabled(v-show="scene.slides.length == 0")
        i.ion-play
      .scene-edit-buttons-upload
        i.ion-upload
        |{{ $store.state.lang[$store.state.conf.lang].control.sheet.upload}}
    .scene-edit-buttons
      .scene-edit-buttons-markdown(@click="markdown.flags.show = true")
        i.ion-android-create
        |{{ $store.state.lang[$store.state.conf.lang].control.sheet.editMarkdown}}
        .scene-edit-buttons-markdown-is-modified(v-show="scene.markdown.text")
    markdown(:flags.sync="markdown.flags", :scene.sync="scene")
</template>
<script>
import markdown from 'components/_markdown'

export default {
  components: {markdown},
  props: ['scene', 'gIndex', 'sIndex'],
  data(){
    return {
      markdown: {
        flags: {
          headerIcon: 'ion-android-create',
          headerLabel: this.$store.state.lang[this.$store.state.conf.lang].control.markdown.headerLabelBefore + this.scene.title + this.$store.state.lang[this.$store.state.conf.lang].control.markdown.headerLabelAfter,
          show: false
        }
      }
    }
  },
  methods: {
    sceneFilter(scene){
      return (!this.$store.state.sheet.filter) ? true : scene.title.toUpperCase().indexOf(this.$store.state.sheet.filter.toUpperCase()) > -1
    },
    sceneNameEdit(event){
      event.stopPropagation()
    }
  }
}
</script>