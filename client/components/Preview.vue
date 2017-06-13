<template lang="pug">
  #preview(v-if="$store.state.output.isPlaying")
    slide(:slide.sync="$store.getters.playingSlide", :scene.sync="$store.getters.playingScene")
</template>

<script>
import slide from 'components/_slide'

export default {
  components: {slide}
}
</script>