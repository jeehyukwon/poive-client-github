<template lang="pug">
  popup(:flags.sync="flags")
    div(slot="main")
      .popup-window-group
        .popup-window-group-title
          i.ion-eye
          |{{ $store.state.lang[$store.state.conf.lang].control.markdown.preview }}
        .popup-window-group-box.slides
          .slides
            .slide(v-for="slide in previewMarkdown")
              slide(:slide.sync="slide", :scene.sync="scene")
            .no-slide(v-if="!previewMarkdown")
              i.ion-alert-circled
              |{{ $store.state.lang[$store.state.conf.lang].control.markdown.previewCaption }}
      .popup-window-group
        .popup-window-group-title
          i.i.ion-android-create
          |{{ $store.state.lang[$store.state.conf.lang].control.markdown.edit }}
        .popup-window-group-box
          .popup-window-group-box-entry
            .popup-window-group-box-entry-label
              i.ion-paintbrush
              |{{ $store.state.lang[$store.state.conf.lang].control.markdown.commonLayout }}
            .popup-window-group-box-entry-select
              select(v-model="scene.markdown.layoutNum", @keydown="$event.stopPropagation()")
                option(v-for="layout, l in scene.template.slideLayout", :value="l") {{(layout.title[$store.state.conf.lang]==undefined)?layout.title.en:layout.title[$store.state.conf.lang]}}
            .popup-window-group-box-entry-textarea
              textarea(v-model="scene.markdown.text", :placeholder="$store.state.lang[$store.state.conf.lang].control.markdown.markdownPlaceholder", @keydown="$event.stopPropagation()")
              .caption
                i.ion-information-circled
                |{{ $store.state.lang[$store.state.conf.lang].control.markdown.markdownCaption }}
    div(slot="footer")
      .popup-window-footer-button(v-if="scene.markdown.text", @click="appendMarkdownToScene(); flags.show = false")
        i.ion-plus
        |{{ $store.state.lang[$store.state.conf.lang].control.markdown.insertSlide }}
      .popup-window-footer-button(v-if="scene.markdown.text", @click="flags.show = false")
        i.ion-close-round
        |{{ $store.state.lang[$store.state.conf.lang].control.markdown.save }}
      .popup-window-footer-button(v-if="!scene.markdown.text", @click="flags.show = false")
        i.ion-close-round
        |{{ $store.state.lang[$store.state.conf.lang].control.markdown.close }}
</template>
<script>
import popup from 'components/_popup'
import slide from 'components/_slide'

export default {
  props: ['flags', 'scene'],
  components: { popup, slide },
  computed: {
    previewMarkdown () {
      var markdown = this.scene.markdown
      if (markdown.text === '') {
        return false
      } else {
        const layout = this.scene.template.slideLayout[markdown.layoutNum]
        var cutText = markdown.text.split(/\n={2}=+\n/)
        var slides = []
        var cutObj = []
        for (var i = 0; i < cutText.length; i++) {
          var slide = {
            obj: [],
            selectedLayout: 0,
            isSceneObj: true,
            layout: {
              title: '',
              ignoreSceneObj: false,
              obj: []
            }
          }
          slides.push(slide)
          slides[i].selectedLayout = markdown.layoutNum
          slides[i].layout.title = layout.title
          slides[i].layout.obj = layout.obj
          cutObj = cutText[i].split(/\n-{2}-+\n/)
          if (cutObj[0] === '\n') {
            cutObj.splice(0, 1)
          }
          for (var j = 0; j < layout.obj.length; j++) {
            if (cutObj[j] !== undefined && cutObj[j][0] === '\n') {
              cutObj[j] = cutObj[j].substr(1, cutObj[j].length)
            }
            slides[i].obj.push(JSON.parse(JSON.stringify(layout.obj[j])))
            slides[i].obj[j].text = cutObj[j]
          }
        }
        return slides
      }
    }
  },
  methods: {
    appendMarkdownToScene () {
      this.scene.slides.push.apply(this.scene.slides, this.previewMarkdown)
      this.scene.markdown.text = ''
    }
  }
}
</script>
