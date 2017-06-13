<template lang="pug">
.top(:class="{'darwin': isDarwin}")
  .top-title
    .top-title-file(@click="$store.commit('openContext', {items: [{label: $store.state.lang[$store.state.conf.lang].top.file.new, dispatch: 'newSheet'}, {label: $store.state.lang[$store.state.conf.lang].top.file.open, dispatch: 'openSheet'}, {divider: true}, {label: $store.state.lang[$store.state.conf.lang].top.file.save, dispatch: 'saveSheet'}, {label: $store.state.lang[$store.state.conf.lang].top.file.saveAs, dispatch: 'saveAsSheet'}], event: $event})"
                    @contextmenu="$store.commit('openContext', {items: [{label: $store.state.lang[$store.state.conf.lang].top.file.new, dispatch: 'newSheet'}, {label: $store.state.lang[$store.state.conf.lang].top.file.open, dispatch: 'openSheet'}, {divider: true}, {label: $store.state.lang[$store.state.conf.lang].top.file.save, dispatch: 'saveSheet'}, {label: $store.state.lang[$store.state.conf.lang].top.file.saveAs, dispatch: 'saveAsSheet'}], event: $event})")
      .top-title-file-modified(v-show="$store.state.sheet.isModified")
      img.top-title-file-icon(:src="fileIcon")
      .top-title-file-label {{ $store.getters.filename }}
      .top-title-file-arrow
        i.ion-ios-arrow-down
  .top-menuset(v-show="$store.state.view.menuset")
    .top-menuset-darwin-margin(v-if="isDarwin", :class="{'active': !isFullscreen}")
    .top-menuset-group-inset
      .top-menuset-group-inset-item(@click="$store.dispatch('prevSlide')")
        i.ion-ios-rewind.small
      .top-menuset-group-inset-item(@click="$store.dispatch('playToggle')")
        i.ion-pause(v-if="$store.state.output.isPlaying")
        i.ion-ios-play.large(v-else)
        //i.ion-ios-arrow-down
      .top-menuset-group-inset-item(@click="$store.dispatch('nextSlide')")
        i.ion-ios-fastforward.small
      .top-menuset-group-inset-item(:class="{'active': $store.state.output.isBlack}", @click="$store.dispatch('blackToggle')")
        i.ion-eye-disabled(v-if="$store.state.output.isBlack")
        i.ion-eye(v-else)
    //.top-menuset-group.right
      .top-menuset-group-item
        i.ion-bug
        .top-menuset-group-item-label 버그 보고
    .top-menuset-windows-control(v-if="!isDarwin")
      .top-menuset-windows-control-hide(@click="minimize()")
        img(:src="winHideIcon")
      .top-menuset-windows-control-full(@click="maximize()")
        img(v-if="!isMaximized", :src="winFullIcon")
        img(v-else, :src="winUnfullIcon")
      .top-menuset-windows-control-close(@click="close()")
        img(:src="winCloseIcon")
    .top-menuset-group.right
      .top-menuset-group-item(:class="{'active': $store.state.settings.flags.show}", @click="$store.state.settings.flags.show = true")
        i.ion-android-settings
    .top-menuset-group.right
      .top-menuset-group-item(@click="$store.commit('viewToggle', 'cloud')", :class="{'active': $store.state.view.cloud}")
        i.ion-cloud
        .top-menuset-group-item-label {{ $store.state.lang[$store.state.conf.lang].top.menuset.cloud }}
      .top-menuset-group-item(@click="$store.commit('viewToggle', 'inspector')", :class="{'active': $store.state.view.inspector}")
        i.ion-ios-compose
        .top-menuset-group-item-label {{ $store.state.lang[$store.state.conf.lang].top.menuset.inspector }}
      .top-menuset-group-item(@click="$store.commit('viewToggle', 'timeline')", :class="{'active': $store.state.view.timeline}")
        i.ion-ios-timer
</template>
<script>
import { remote } from 'electron'
import { isDarwin } from 'electron-platform'
const browserWindow = remote.BrowserWindow.getFocusedWindow()

import fileIcon from 'assets/images/icon_file.svg'
import winHideIcon from 'assets/images/win_hide.svg'
import winFullIcon from 'assets/images/win_full.svg'
import winUnfullIcon from 'assets/images/win_unfull.svg'
import winCloseIcon from 'assets/images/win_close.svg'

export default {
  components: {},
  data () {
    return {
      fileIcon,
      winHideIcon,
      winFullIcon,
      winUnfullIcon,
      winCloseIcon,
      isFullscreen: false,
      isMaximized: false,
      isDarwin
    }
  },
  methods: {
    maximize () {
      if (browserWindow.isMaximized()) browserWindow.unmaximize()
      else browserWindow.maximize()
      this.isMaximized = !this.isMaximized
    },
    minimize () {
      browserWindow.minimize()
    },
    close () {
      window.close()
    }
  },
  mounted () {
    browserWindow.on('enter-full-screen', (event) => { this.isFullscreen = true })
    browserWindow.on('leave-full-screen', (event) => { this.isFullscreen = false })
  }
}
</script>
