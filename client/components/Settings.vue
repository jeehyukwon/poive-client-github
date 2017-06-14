<template lang="pug">
  popup(:flags.sync="flags")
    div(slot="main")
      .popup-window-group
        .popup-window-group-title
          i.ion-paintbrush
          |{{ $store.state.lang[$store.state.conf.lang].settings.interface.titleLabel }}
        .popup-window-group-box
          .popup-window-group-box-entry
            .popup-window-group-box-entry-label
              i.ion-earth
              |{{ $store.state.lang[$store.state.conf.lang].settings.interface.language }}
            .popup-window-group-box-entry-select
              select(v-model="$store.state.conf.lang", @change="$store.commit('changeConf')")
                option(value="ko") 한국어
                option(value="en") English
          .popup-window-group-box-entry
            .popup-window-group-box-entry-label
              i.ion-ios-search-strong
              |{{ $store.state.lang[$store.state.conf.lang].settings.interface.zoom }}
            .popup-window-group-box-entry-select
              select(v-model="$store.state.conf.scale", @change="$store.commit('changeConf'); $store.commit('changeScale');")
                option(value="0.90") 90%
                option(value="0.95") 95%
                option(value="1") 100%
                option(value="1.05") 105%
                option(value="1.1") 110%
                option(value="1.15") 115%
                option(value="1.2") 120%
      .popup-window-group
        .popup-window-group-title
          i.ion-outlet
          |{{ $store.state.lang[$store.state.conf.lang].settings.io.titleLabel }}
        .popup-window-group-box
          .popup-window-group-box-entry
            .popup-window-group-box-entry-label
              i.ion-ios-videocam
              |{{ $store.state.lang[$store.state.conf.lang].settings.io.outputDisplay }}
            .popup-window-group-box-entry-select
              select(v-model="$store.state.conf.outputDisplay", @change="$store.commit('changeOutputScreen')")
                option(v-for="screen, i in $store.state.conf.screens", :value="i") {{ $store.state.lang[$store.state.conf.lang].settings.io.display }} {{ i+1 }}
      .popup-window-group
        .popup-window-group-title
          i.ion-paintbucket
          |{{ $store.state.lang[$store.state.conf.lang].settings.templates.titleLabel }}
        .popup-window-group-box.templates
          .popup-window-group-box-template(v-for="template, i in $store.state.templates")
            .popup-window-group-box-template-title {{ (template.title[$store.state.conf.lang]==undefined) ? template.title.en : template.title[$store.state.conf.lang]}}
            .popup-window-group-box-template-author {{ template.author }}
            .popup-window-group-box-template-buttons
              .popup-window-group-box-template-buttons-button.active(v-show="i == $store.state.conf.defaultTemplate")
                i.ion-checkmark
                |{{ $store.state.lang[$store.state.conf.lang].settings.templates.isDefault }}
              .popup-window-group-box-template-buttons-button(v-show="i != $store.state.conf.defaultTemplate", @click="$store.commit('changeDefaultTemplate', i)")
                i.ion-checkmark
                |{{ $store.state.lang[$store.state.conf.lang].settings.templates.setAsDefault}}
              .popup-window-group-box-template-buttons-button(v-show="i != $store.state.conf.defaultTemplate", @click="$store.commit('deleteTemplate', i)")
                i.ion-android-delete
                |{{$store.state.lang[$store.state.conf.lang].settings.templates.delete }}
          .popup-window-group-box-add-template(@click="$store.commit('installTemplate')")
            i.ion-android-open
            |{{ $store.state.lang[$store.state.conf.lang].settings.templates.install }}
      //.popup-window-group
        .popup-window-group-title
          i.ion-cloud
          |버전
        .popup-window-group-box
          .popup-window-group-box-entry
            .popup-window-group-box-entry-label
              i.ion-checkmark
              |현재 버전
            .popup-window-group-box-entry-text
              i.ion-social-apple
              |macOS - 1.0.1
          .popup-window-group-box-entry
            .popup-window-group-box-entry-label
              i.ion-cloud
              |업데이트
            .popup-window-group-box-entry-text
              i.ion-social-apple
              |macOS - 1.3
    div(slot="footer")
      .popup-window-footer-button
        i.ion-heart
        |{{ $store.state.lang[$store.state.conf.lang].settings.license }}
      .popup-window-footer-button(@click="flags.show = false")
        i.ion-close-round
        |{{ $store.state.lang[$store.state.conf.lang].settings.close }}
</template>
<script>
import popup from 'components/_popup'

export default {
  props: ['flags'],
  components: { popup }
}
</script>
