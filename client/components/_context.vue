<template lang="pug">
transition(name="context")
  #context(v-show="$store.state.context.isActive")
    #context-menu
      transition(name="context-menu")
        .context-menu-items(v-if="$store.state.context.isActive")
          div(v-for="item in $store.state.context.items")
            .context-menu-item.divider(v-if="item.divider === true")
            .context-menu-item.disabled(v-else-if="item.disabled === true") {{item.label}}
            .context-menu-item(v-else-if="item.divider === undefined", @click="contextItemClick(item, $event)") {{item.label}}
    .context-background(@click="$store.state.context.isActive = false")
</template>
<script>
import $ from 'jquery'
export default {
  methods: {
    contextItemClick (item, event) {
      $(event.currentTarget).addClass('click')
      this.$store.state.context.isActive = false
      if (item.dispatch !== undefined) {
        if (item.param === undefined) {
          this.$store.dispatch(item.dispatch)
        } else {
          this.$store.dispatch(item.dispatch, item.param)
        }
      } else if (item.commit !== undefined) {
        if (item.param === undefined) {
          this.$store.commit(item.commit)
        } else {
          this.$store.commit(item.commit, item.param)
        }
      }
    }
  }
}
</script>
<style>
.context-enter-active {
  transition: none
}
.context-leave-active {
  transition: opacity;
  transition-delay: 0;
  transition-duration: .2s;
}
.context-enter, .context-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}

.context-menu-enter-active {
  transition: none
}
.context-menu-leave-active {
  transition: opacity;
  transition-delay: .35s;
  transition-duration: 0;
}
.context-menu-enter, .context-menu-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
