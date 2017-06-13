<template lang="pug">
.inspector-obj(v-if="value.editable")
  .title
    i.ion-image(v-if="value.type == 'image'")
    i.ion-cube(v-else)
    |{{ (value.title[$store.state.conf.lang]===undefined)?value.title.en:value.title[$store.state.conf.lang] }}
  .select(v-if="value.typeSelectable")
    i.ion-code
    select(v-model="value.type")
      option(value="oneLine") {{ $store.state.lang[$store.state.conf.lang].inspector.obj.type.oneLine }}
      option(value="multiLine") {{ $store.state.lang[$store.state.conf.lang].inspector.obj.type.multiLine }}
      option(value="sceneTitle") * {{ $store.state.lang[$store.state.conf.lang].inspector.obj.type.sceneTitle }}
      option(value="pageNumber") * {{ $store.state.lang[$store.state.conf.lang].inspector.obj.type.pageNumber }}
      option(value="continueIcon") * {{ $store.state.lang[$store.state.conf.lang].inspector.obj.type.continueIcon }}
  .style-select(v-if="value.styleSelectable", @click="value.isAltStyle = !value.isAltStyle", :class="{'a': !value.isAltStyle, 'b': value.isAltStyle}")
    i.ion-android-star-outline(v-if="value.isAltStyle")
    i.ion-android-star(v-else)
    |{{ value.isAltStyle?$store.state.lang[$store.state.conf.lang].inspector.obj.altStyle.styleB:$store.state.lang[$store.state.conf.lang].inspector.obj.altStyle.styleA}}
  .input(v-if="value.type=='oneLine'")
    i.ion-edit
    input(type="text", v-model="value.text", :placeholder="(value.title[$store.state.conf.lang]===undefined)?value.title.en:value.title[$store.state.conf.lang]")
  .input(v-if="value.type=='multiLine'")
    i.ion-compose
    textarea(:placeholder="(value.title[$store.state.conf.lang]===undefined)?value.title.en:value.title[$store.state.conf.lang]", v-model="value.text")
  .image(v-if="value.type=='image'")
    .image-preview(:class="{'empty': value.img === '' || value.img === undefined}")
      |{{ (value.img === '' || value.img === undefined) ? $store.state.lang[$store.state.conf.lang].inspector.obj.img.blankImageCaption : '' }}
      img(v-if="value.img != ''", :src="value.img")
    .image-button(@click="encodeImage()")
      i.ion-image
      i.ion-android-share
      |{{ (value.img == '' || value.img === undefined) ? $store.state.lang[$store.state.conf.lang].inspector.obj.img.addImage : $store.state.lang[$store.state.conf.lang].inspector.obj.img.changeImage }}
    .image-button.delete(v-if="value.img !== '' && value.img !== undefined", @click="deleteImage()")
      i.ion-android-delete
      |{{$store.state.lang[$store.state.conf.lang].inspector.obj.img.deleteImage}}
</template>

<script>
import { remote } from 'electron'
const { dialog } = remote

import base64Img from 'base64-img'

export default {
  props: ['value'],
  data () {
    return {}
  },
  methods: {
    encodeImage () {
      dialog.showOpenDialog({
        filters: [
          { name: 'PNG Image', extensions: ['png'] },
          { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] }
        ]
      }, (filenames) => {
        if (filenames !== undefined) {
          var val = JSON.parse(JSON.stringify(this.value))
          val.img = base64Img.base64Sync(filenames[0])
          this.$emit('input', val)
        }
      })
    },
    deleteImage () {
      this.value.img = ''
      this.$emit('input', this.value)
    }
  }
}
</script>
