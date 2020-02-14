<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from "@/components/Header"
import Tab from "@/components/Tab"
import Player from "./views/Player"

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="scss">
</style>
