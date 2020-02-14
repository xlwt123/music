<template>
  <scroll class="music-list" ref="musicList">
    <div class="back text-center" @click="back">
      <i class="iconfont icon-back"></i>
    </div>
    <h1 class="title m-0 fs-xm" v-html="detail.name"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage" @click="showInfo">
      <div class="filter"></div>
      <div class="comments text-center bg-bg-h" ref="commentBtn" @click.stop="toComment">
        <i class="iconfont icon-pinglun"></i>
      </div>
    </div>
    <transition name="info">
      <div class="info bg-bg p-4" v-show="infoShow">
        <div class="background">
          <img :src="detail.coverImgUrl" class="w-100 h-100">
        </div>
        <div class="close">
          <i class="iconfont icon-close" @click="closeInfo"></i>
        </div>
        <scroll class="info-wrapper">
          <div class="">
            <div class="img-title text-center pt-5">
              <img :src="detail.coverImgUrl" class="img" width="250" height="250">
              <h1 class="name fs-l">{{detail.name}}</h1>
            </div>
            <div class="desc pt-4 fs-m text-center" v-html="detail.description"></div>
          </div>
        </scroll>
      </div>
    </transition>
    <div class="layer w-100 h-100" ref="layer"></div>
    <div class="play2 pl-3 fs-m" v-show="top" @click="playAll">播放全部(共{{songs.length}}首)</div>
    <scroll :data="songs" :listen-scroll="true" :probe-type="3" class="list" @scroll="scroll" :click="false" ref="scroll">
      <div class="song-list-wrapper">
        <div class="play pl-3 fs-m" @click="playAll">播放全部(共{{songs.length}}首)</div>
        <song-list :list="songs" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </scroll>
</template>

<script>
import SongList from "@/components/SongList"
import Scroll from "@/components/Scroll"
import Loading from "@/components/Loading"
import { playListMixin } from '../assets/js/mixin'
import { mapActions } from 'vuex'

const RESERVED_HEIGHT = 44

export default {
  mixins: [playListMixin],
  components: {
    SongList,
    Scroll,
    Loading
  },
  props: {
    detail: {
      type: Object
    },
    songs: {
      type: Array
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      scrollY: 0,
      top: false,
      infoShow: false
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y 
    },
    selectItem(item, index) {
      this.selectPlay({ list: this.songs, index: index })
    },
    playAll() {
      this.selectPlay({ list: this.songs, index: 0 })
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    showInfo() {
      this.infoShow = true
      this.$refs.musicList.$el.style.zIndex = 200
    },
    closeInfo() {
      this.infoShow = false
      this.$refs.musicList.$el.style.zIndex = 100 
    },
    toComment() {
      this.$router.push(`/comment/playlist/${this.id}`)
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.detail.coverImgUrl})`
    }
  },
  watch: {
    scrollY: function(newVal) {
      let translateY = Math.max(this.minTransalteY, newVal)
      let zIndex = 0
      let scale = 1
      this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
      const percent = Math.abs(newVal / this.imageHeight)
      if (newVal > 0) {
        scale = 1 + percent
        zIndex = 10
      }
      if (newVal < this.minTransalteY) {
        zIndex = 10
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.bgImage.style.zIndex = zIndex
        this.top = true
        this.$refs.commentBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.height = `40%`
        this.top = false
        this.$refs.commentBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background: #222;
  .back {
    position: absolute;
    top: 0;
    left: 0;
    width: 10%;
    height: 44px;
    z-index: 100;
    line-height: 44px;
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    right: 0;
    font-weight: 400;
    height: 44px;
    line-height: 44px;
    z-index: 100;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 40%;
    background-size: cover;
    transform-origin: top;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
    .comments {
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      line-height: 50px;
    }
  }
  
  .info {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 200;
    &.info-enter-avtive, &.info-leave-active {
      transition: opacity .4s;
    }
    &.info-enter, &.info-leave-to {
      opacity: 0;
    }
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.4;
      filter: blur(50px);
    }
    .info-wrapper {
      height: 100%;
      overflow: hidden;
      .img {
        border-radius: 5px;
      }
      .desc {
        white-space: pre-line;
        line-height: 1.4;
      }
    }
  }
  .layer {
    background: #222;
    position: relative;
  }
  .play2 {
    height: 50px;
    line-height: 50px;
    position: fixed;
    top: 44px;
    width: 100%;
    background: #222;
    z-index: 10;
  }
  .list {
    position: fixed;
    top: 40%;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #222;
    .play {
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
