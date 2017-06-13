<template lang="pug">
#cloud
  .cloud-tab
    .cloud-tab-item(@click="$store.state.view.cloudTab = 0", :class="{'active': $store.state.view.cloudTab == 0}")
      i.ion-cloud
      .cloud-tab-item-label {{ $store.state.lang[$store.state.conf.lang].cloud.cloud.tabLabel }}
    .cloud-tab-item(@click="$store.state.view.cloudTab = 1", :class="{'active': $store.state.view.cloudTab == 1}")
      i.ion-bag
      .cloud-tab-item-label {{ $store.state.lang[$store.state.conf.lang].cloud.market.tabLabel }}
  .cloud-main
    .cloud-main-locked
        .cloud-main-locked-label
          .title
            i.ion-hammer
            |{{ $store.state.lang[$store.state.conf.lang].cloud.comingSoon.title }}
          .subtitle
            |{{ $store.state.lang[$store.state.conf.lang].cloud.comingSoon.subtitle }}
</template>
<script>
export default {

}
</script>