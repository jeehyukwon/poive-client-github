<template lang="pug">
  #inspector
    .inspector-tab
      .inspector-tab-item(@click="$store.state.view.inspectorTab = 0", :class="{'active': $store.state.view.inspectorTab == 0}")
        i.ion-pricetag
        .inspector-tab-item-label {{ $store.state.lang[$store.state.conf.lang].inspector.scene.tabLabel }}
      .inspector-tab-item(@click="$store.state.view.inspectorTab = 1", :class="{'active': $store.state.view.inspectorTab == 1}")
        i.ion-qr-scanner
        .inspector-tab-item-label {{ $store.state.lang[$store.state.conf.lang].inspector.slide.tabLabel }}
    .inspector-main
      .inspector-main-locked(v-show="$store.state.view.sheetLock")
        .inspector-main-locked-label
          .title
            i.ion-lock-combination
            |{{ $store.state.lang[$store.state.conf.lang].inspector.locked.title }}
          .subtitle
            |{{ $store.state.lang[$store.state.conf.lang].inspector.locked.subtitle }}
      div(v-if="$store.state.view.inspectorTab == 0")
        .inspector-main-wrapper(v-if="$store.getters.selectedScene")
          .inspector-preview
            .inspector-preview-title
              i.ion-eye
              |{{ $store.state.lang[$store.state.conf.lang].inspector.scene.preview }}
            .inspector-preview-slide
              slide(:slide.sync="$store.getters.selectedSlide", :scene.sync="$store.getters.selectedScene")
          .inspector-scene-template-select
            .title
              i.ion-paintbucket
              |{{ $store.state.lang[$store.state.conf.lang].inspector.scene.template }}
            select(v-model="$store.getters.selectedScene.selectedTemplate", @change="$store.dispatch('setSceneTemplateAndSet', {groupNum: $store.state.sheet.selected.groupNum, sceneNum: $store.state.sheet.selected.sceneNum, template: $store.state.templates[$store.state.sheet.groups[$store.state.sheet.selected.groupNum].scenes[$store.state.sheet.selected.sceneNum].selectedTemplate]})")
              option(v-for="template, i in $store.state.templates", :value="i") {{(template.title[$store.state.conf.lang]==undefined)?template.title.en:template.title[$store.state.conf.lang]}}
          obj(v-for="obj, i in $store.getters.selectedScene.obj", :key="obj.id", v-model="$store.getters.selectedScene.obj[i]")
        .inspector-main-no-wrapper(v-else)
          .title
            i.ion-alert-circled
            |{{ $store.state.lang[$store.state.conf.lang].inspector.noScene.title }}
          .subtitle
            |{{ $store.state.lang[$store.state.conf.lang].inspector.noScene.subtitle }}
      div(v-if="$store.state.view.inspectorTab == 1")
        .inspector-main-wrapper(v-if="$store.getters.selectedSlide")
          .inspector-preview
            .inspector-preview-title
              i.ion-eye
              |{{ $store.state.lang[$store.state.conf.lang].inspector.slide.preview }}
            .inspector-preview-slide
              slide(:slide.sync="$store.getters.selectedSlide", :scene.sync="$store.getters.selectedScene")
          .inspector-slide-layout-select
            .title
              i.ion-paintbrush
              |{{ $store.state.lang[$store.state.conf.lang].inspector.slide.layout }}
            select(v-model="$store.getters.selectedSlide.selectedLayout", @change="$store.dispatch('setSlideLayoutAndSet', {groupNum: $store.state.sheet.selected.groupNum, sceneNum: $store.state.sheet.selected.sceneNum, slideNum: $store.state.sheet.selected.slideNum, layoutNum: $store.getters.selectedSlide.selectedLayout})")
              option(v-for="layout, i in $store.getters.selectedScene.template.slideLayout", :value="i") {{(layout.title[$store.state.conf.lang] == undefined)?layout.title.en:layout.title[$store.state.conf.lang]}}
          .inspector-slide-is-scene-obj(:class="{'on': $store.getters.selectedSlide.isSceneObj}", @click="$store.getters.selectedSlide.isSceneObj = !$store.getters.selectedSlide.isSceneObj")
            .title
              i.ion-pricetag
              |{{ $store.state.lang[$store.state.conf.lang].inspector.slide.isSceneObj }}
          obj(v-for="obj, i in $store.getters.selectedSlide.obj", :key="obj.id", v-model="$store.getters.selectedSlide.obj[i]")
        .inspector-main-no-wrapper(v-else)
          .title
            i.ion-alert-circled
            |{{ $store.state.lang[$store.state.conf.lang].inspector.noSlide.title }}
          .subtitle
            |{{ $store.state.lang[$store.state.conf.lang].inspector.noSlide.subtitle }}
</template>

<script>
import slide from 'components/_slide'
import obj from 'components/_inspector.obj'

export default {
  components: {slide, obj}
}
</script>