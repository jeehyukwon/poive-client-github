<template lang="pug">
  #control(tabindex="1")
    .control-top
      .control-top-filter
        i.ion-funnel
        input(type="text", v-model="$store.state.sheet.filter", :placeholder="$store.state.lang[$store.state.conf.lang].control.top.filter", @keydown="$event.stopPropagation()")
      .control-top-button(:class="{'active': $store.state.view.controlScenes}", @click="$store.commit('viewToggle', 'controlScenes')")
        i.ion-pricetags
        |{{ $store.state.lang[$store.state.conf.lang].control.top.groupAndScene }}
      .control-top-button
        i.ion-upload
        |{{ $store.state.lang[$store.state.conf.lang].control.top.upload }}
      .control-top-button.right(:class="{'active': $store.state.view.sheetLock}", @click="$store.state.view.sheetLock = !$store.state.view.sheetLock")
        i.ion-unlocked(v-if="!$store.state.view.sheetLock")
        i.ion-locked(v-else)
        |{{ $store.state.lang[$store.state.conf.lang].control.top.lock }}
    .control-main
      .control-scenes(v-show="$store.state.view.controlScenes")
        ul.groups
          draggable(v-model="$store.state.sheet.groups", :options="{group: 'group', animation: 300, handle: '.group-handle'}")
            li.group(v-for="group, gIndex in $store.state.sheet.groups")
              .group-title(@contextmenu="$store.commit('openContext', {items: [{label: $store.state.lang[$store.state.conf.lang].control.sheet.deleteGroup, commit: 'deleteGroup', param: {groupNum: gIndex}}], event: $event})")
                i.ion-ios-flag
                input(type="text", v-model="group.title", @keydown="$event.stopPropagation()")
              .group-handle
                i.ion-navicon
              ul.scenes
                draggable(v-model="group.scenes", :options="{group: 'scene', animation: 300, handle: '.scene-blank'}")
                  scenes-scene(v-for="scene, sIndex in group.scenes", :key="sIndex", :scene.sync="scene", :sIndex.sync="sIndex", :gIndex.sync="gIndex")
              .scenes
                li.add-scene(@click="$store.dispatch('addSceneAndSet', gIndex)", v-if="!$store.state.sheet.filter && !$store.state.view.sheetLock")
                  i.ion-android-add
                  |{{ $store.state.lang[$store.state.conf.lang].control.sheet.addScene }}
        .groups
          li.add-group(@click="$store.dispatch('addGroupAndSet')", v-if="!$store.state.sheet.filter && !$store.state.view.sheetLock")
            i.ion-android-add
            |{{ $store.state.lang[$store.state.conf.lang].control.sheet.addGroup }}
        .control-scenes-scrollbar-margin
      .control-slides
        ul.groups
          li.group(v-for="group, gIndex in $store.state.sheet.groups")
            ul.scenes
              slidesScene(v-for="scene, sIndex in group.scenes", :key="scene.id", v-model="scene", :sIndex.sync="sIndex", :gIndex.sync="gIndex")
            .add-scene(v-show="!$store.state.sheet.filter && !$store.state.view.sheetLock")
          .group(v-if="!$store.state.sheet.filter && !$store.state.view.sheetLock")
</template>

<script>
import resizable from 'jquery-ui/ui/widgets/resizable'

import draggable from 'vuedraggable'

import slide from 'components/_slide'
import scenesScene from 'components/_control.scenes.scene'
import slidesScene from 'components/_control.slides.scene'

export default {
  components: {slide, scenesScene, slidesScene, draggable},
  computed: {
  },
  methods: {},
  mounted(){
    // Resizable Scenes
    /*resizable({
      handles: "e",
      minWidth: 180
    }, this.$el.children[1].children[0])*/

    // Scroll Syncing between .control-scenes, .control-slides
    let isScenesScrolling = false
    let isSlidesScrolling = false
    const controlScenes = this.$el.children[1].children[0]
    const controlSlides = this.$el.children[1].children[1]
     controlScenes.onscroll = function() {
      if (!isScenesScrolling) {
        isSlidesScrolling = true;
        controlSlides.scrollTop = this.scrollTop;
      }
      isScenesScrolling = false;
    }
    controlSlides.onscroll = function() {
      if (!isSlidesScrolling) {
        isScenesScrolling = true;
        controlScenes.scrollTop = this.scrollTop;
      }
      isSlidesScrolling = false;
    }
  }
}
</script>
<!--  this.$store.state.count 
      this.$store.commit('INCREMENT');
      this.$store.dispatch('incrementAsync');
-->
