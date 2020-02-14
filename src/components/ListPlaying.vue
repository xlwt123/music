<template>
  <transition name="fade">
    <div class="list-playing bg-bg-d" v-show="showFlag" @click="hide">
      <div class="list-wrapper w-100 bg-bg-h" @click.stop>
        <div class="list-header">
          <h1 class="title d-flex ai-center m-0">
            <i class="iconfont mr-2 fs-l text-theme-d" :class="iconMode" @click="changePlayMode"></i>
            <span class="text flex-1 fs-m text-text-l">{{modeText}}</span>
            <i class="iconfont icon-clear fs-s text-text-d"></i>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content">
          <transition-group name="list" tag="ul" class="m-0 p-0">
            <li
              ref="listItem" 
              class="item d-flex ai-center"
              v-for="(item, index) of playList" 
              :key="item.id"
              @click="selectItem(item, index)"
            >
              <i class="current fs-s text-theme-d iconfont" :class="getCurrentIcon(item)"></i>
              <span class="text flex-1 fs-m text-text-d text-ellipsis">{{item.name}}</span>
              <span class="delete text-theme" @click.stop="delectOne(item)">
                <i class="iconfont icon-delete fs-xs"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-close text-center bg-bg fs-xm text-text-l" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from '@/components/Scroll'
import { playMode } from '../assets/js/config'
import { mapActions } from 'vuex'
import { playerMixin } from '../assets/js/mixin'

export default {
  mixins: [playerMixin],
  components: {
    Scroll
  },
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    getCurrentIcon(item) {
      if (item.id === this.currentSong.id) {
        return 'icon-play'
      }
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex(song => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    delectOne(item) {
      this.delectSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return song.id === current.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    ...mapActions([
      'delectSong'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id || !this.showFlag) {
        return
      }
      this.scrollToCurrent(newSong)
    },
    mode() {
      this.scrollToCurrent(this.currentSong)
    }
  },
}
</script>

<style lang="scss" scoped>
.list-playing {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  &.fade-enter-active, &.fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.fade-enter, &.fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    .list-header {
      position: relative;
      padding: 20px 30px 20px 20px;
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s
        }
        &.list-enter, &.list-leave-to {
          height: 0
        }
        .current {
          flex: 0 0 20px;
          width: 20px;

        }
      }
    }
    .list-close {
      line-height: 50px;
    }
  }
}
</style>