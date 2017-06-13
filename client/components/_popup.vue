<template lang="pug">
  transition(name="popup")
    .popup(v-show="flags.show")
      .popup-window
        .popup-window-header
          i(:class="flags.headerIcon")
          .popup-window-header-label {{ flags.headerLabel }}
        .popup-window-main
          slot(name="main")
        .popup-window-footer
          slot(name="footer")
      .popup-background(@click="flags.show = false")
</template>
<script>
export default {
  props: ['flags']
}
</script>
<style scoped>
.popup-enter-active{
    transition: .3s
}

.popup-leave-active {
    transition: .3s
}
.popup-enter{
    opacity:0;
    transform: translate(0, -1%);
}
.popup-leave-to{
    opacity: 0;
    transform: translate(0, -1%);
}
</style>