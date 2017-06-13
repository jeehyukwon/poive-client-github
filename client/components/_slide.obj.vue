<template lang="pug">
.component-slide-obj
  .text(v-if="obj.type == 'staticText'", :style="(obj.isAltStyle)?obj.altStyle.text:obj.style.text")
    |{{ obj.text }}
  .text(v-if="obj.type == 'oneLine'", :style="(obj.isAltStyle)?obj.altStyle.text:obj.style.text")
    |{{ obj.text }}
  .text(v-if="obj.type == 'multiLine'", :style="(obj.isAltStyle)?obj.altStyle.text:obj.style.text")
    |{{ obj.text }}
  .text(v-if="obj.type == 'sceneTitle'", :style="(obj.isAltStyle)?obj.altStyle.text:obj.style.text")
    |{{ scene.title }}
  .text(v-if="obj.type == 'pageNumber'", :style="(obj.isAltStyle)?obj.altStyle.text:obj.style.text")
    |{{ scene.slides.indexOf(slide) + 1 }}
  .icon(v-if="obj.type == 'continueIcon'", :style="(obj.isAltStyle)?obj.altStyle.text:obj.style.text")
    i(v-if="scene.slides.indexOf(slide)+1 != scene.slides.length").ion-play
    i(v-else).ion-stop
  img(v-if="obj.type == 'image' && obj.img != ''", :src="obj.img", :style="obj.style.img")
</template>
<script>
export default {
  props: ['obj', 'scene', 'slide']
}
</script>
<style lang="scss">
.component-slide-obj{
  //background-color: rgba(255, 255, 255, .1);
  font-size: 1em;
  position: absolute;
  & > .text{
    font: caption;
    font-size: 1em;
    white-space: pre-line;
    word-wrap: break-word;
    word-break: keep-all;
  }
  & > img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>