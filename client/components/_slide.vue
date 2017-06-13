<template lang="pug">
.component-slide(:style="scene.style")
  div(v-if="slide.isSceneObj")
    obj(v-for="obj in scene.obj", :key="obj.id", :obj.sync="obj", :scene.sync="scene", :slide.sync="slide", :style="(obj.isAltStyle)?obj.altStyle:obj.style")
  obj(v-for="obj in slide.obj", :key="obj.id", :obj.sync="obj", :scene.sync="scene", :slide.sync="slide", :style="(obj.isAltStyle)?obj.altStyle:obj.style")
</template>

<script>
import $ from 'jquery'

import obj from 'components/_slide.obj.vue'

export default {
  components: { obj },
  props: ['slide', 'scene', 'resizable', 'output'],
  mounted () {
    var element = $(this.$el)
    if (this.output === undefined) {
      // output 화면이 아닌 경우
      if (this.resizable === undefined || this.resizable === 'width') {
        // width 기준으로 resize 하는 경우
        element.parent().ready(() => {
          element.css('height', element.parent().width() / 4 * 3)
          element.css('font-size', element.height() / 30)
          element.parents().resize(() => {
            element.css('height', element.parent().width() / 4 * 3)
            element.css('font-size', element.height() / 30)
          })
        })
      } else {
        // height 기준으로 resize 하는 경우
        element.parent().ready(() => {
          element.css('width', element.parent().height() / 3 * 4)
          element.css('font-size', element.width() / 40)
          element.parents().resize(() => {
            element.css('width', element.parent().height() / 3 * 4)
            element.css('font-size', element.width() / 40)
          })
        })
      }
    } else {
      // output인 경우
      element.parent().ready(() => {
        element.css('width', $(window).width())
        element.css('height', $(window).height())
        element.css('font-size', Math.min($(window).height() / 30, $(window).width() / 40))
        $(window).resize(() => {
          element.css('width', $(window).width())
          element.css('height', $(window).height())
          element.css('font-size', Math.min($(window).height() / 30, $(window).width() / 40))
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.component-slide{
  overflow: hidden;
  position: relative;
  width:100%;
}
</style>
