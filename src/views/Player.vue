<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="songImage(currentSong.album)" class="w-100 h-100">
        </div>
        <div class="top text-center">
          <div class="back" @click="back">
            <i class="iconfont icon-back"></i>
          </div>
          <h1 class="title fs-l text-ellipsis" v-html="currentSong.name"></h1>
          <h2 class="subtitle fs-m m-0" v-html="artistsList(currentSong.artists)"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img :src="songImage(currentSong.album)" class="image w-100 h-100">
              </div>
            </div>
            <p class="playing-lyric text-center fs-m pt-5">{{playingLyric}}</p>
          </div>
          <scroll class="middle-r w-100" ref="lyricList">
            <div class="lyric-wrapper text-center">
              <div v-if="this.currentSong.lyric">
                <p class="text text-text-l fs-m m-0" 
                  ref="lyricLine" 
                  v-for="(line, index) of currentLyric.lines" 
                  :key="index" 
                  :class="{'current': currentLineNum === index}"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="bot-wrapper d-flex jc-around px-5 w-100">
            <div class="like">
              <i class="iconfont icon-not-favorite"></i>
            </div>
            <router-link :to="`/comment/music/${currentSong.id}`" class="comment" tag="div">
              <i class="iconfont icon-pinglun"></i>
            </router-link>
          </div>
          <div class="dot-wrapper">
            <span class="dot bg-text-d" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot bg-text-d" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l fs-s">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r fs-s">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="iconfont" :class="iconMode" @click="changePlayMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="iconfont icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i class="iconfont" :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i class="iconfont icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-playlist" @click="showListPlaying"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="songImage(currentSong.album)" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name text-ellipsis fs-m text-text m-0" v-html="currentSong.name"></h2>
          <p class="desc text-ellipsis fs-s text-text-d m-0" v-html="artistsList(currentSong.artists)"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlay" class="icon-mini iconfont text-theme" :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="iconfont icon-playlist text-theme" @click.stop="showListPlaying"></i>
        </div>
      </div>
    </transition>
    <list-playing ref="listPlaying"></list-playing>
    <audio ref="audio" :src="currentSong.url" @canplaythrough="ready" @error="error" @timeupdate="updateTime" @ended="songEnd"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from '@/components/ProgressBar'
import Scroll from '@/components/Scroll'
import ListPlaying from '@/components/ListPlaying'
import { playMode } from '../assets/js/config'
import { ERR_OK } from "../api/config"
import songApi from '../api/song'
import MyLyric from '../assets/js/lyricParser'
import { format } from '../assets/js/util'
import { playerMixin } from '../assets/js/mixin'

export default {
  mixins: [playerMixin],
  components: {
    ProgressBar,
    Scroll,
    ListPlaying
  },
  data() {
    return {
      songReady: false,
      currentTime: 0,
      duration: 0,
      currentLyric: null,
      currentLineNum: 0,
      lyricTime: 0,
      playingLyric: '',
      currentShow: 'cd',
      touch: {}
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playing',
    ]),
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    },
    disableClass() {
      return this.songReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.duration
    }
  },
  methods: {
    artistsList(arr) {
      if (arr) {
        let result = []
        arr.forEach(item => {
          result.push(item.name)
        })
        return result.join('/')
      }
    },
    songImage(obj) {
      if (obj) {
        return obj.picUrl
      }
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      let {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        }, 
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      let {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style.transform = ''
    },
    showListPlaying() {
      this.$refs.listPlaying.show()
    },
    togglePlay() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    next() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
      }
      this.songReady = false
    },
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
      }
      
      this.songReady = false
    },
    ready() {
      this.songReady = true
      this.duration = this.$refs.audio.duration
    },
    error() {
      this.songReady = true
    },
    songEnd() {
      if (this.mode === playMode.loop) {
        this.loop()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    onProgressBarChange(percent) {
      this.$refs.audio.currentTime = this.duration * percent
      if (this.currentLyric) {
        this.currentLyric.seek(this.$refs.audio.currentTime * 1000)
      }
      if (!this.playing) {
        this.togglePlay()
      }
    },
    toComment() {
      this.$router.push(`/comment/music/${this.currentSong.id}`)
    },
    getSongLyric() {
      if (!this.currentSong.lyric) {
        songApi.getLyric(this.currentSong.id).then(res => {
          if (res.status === ERR_OK) {
            res.data.lrc === undefined ? this.setSongLyric('noLyric') : this.setSongLyric(res.data.lrc.lyric)
            this.initLyric()
          }
        })
      } else {
        this.initLyric()
      }
    },
    initLyric() {
      this.currentLyric = new MyLyric(this.currentSong.lyric, this.handleLyric)
      if (this.playing) {
        this.currentLyric.play()
      }
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style['transitionDuration'] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style['transitionDuration'] = 0
    },
    middleTouchEnd() {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style['transitionDuration'] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style['transitionDuration'] = `${time}ms`
      this.touch.initiated = false
    },
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingTop = 80
      const paddingBottom = 30
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const x = -((windowWidth / 2) - paddingLeft)
      const y = windowHeight - paddingTop - paddingBottom -  ((windowWidth * 0.8) / 2)
      const scale = targetWidth / (windowHeight * 0.8)
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setSongLyric: 'SET_SONG_LYRIC'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return 
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getSongLyric()
      }, 1000)
    },
    playing(val) {
      const audio = this.$refs.audio
      this.lyricTime = audio.currentTime
      this.$nextTick(() => {
        val ? audio.play() : audio.pause()
      })
    }
  },
  created() {
    this.format = format
  },
}
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 150;
      background: #222;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 9px;
            transform: rotate(-90deg);
          }
        }
        .title {
          display: inline-block;
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          font-weight: 400;
        }
        .subtitle {
          line-height: 20px;
          font-weight: 400;
          margin-top: -5px;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 160px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play {
                animation: rotate 20s linear infinite;
              }
              &.pause {
                animation-play-state: paused;
              }
              .image {
                position: absolute;
                left: 0;
                top: 0;
                border-radius: 50%;
              }
            }
          } 
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          overflow: hidden;
          height: 90%;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            .text {
              line-height: 32px;
              &.current {
                color: #fff;
              }
            }
          }  
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .bot-wrapper {
          position: absolute;
          top: -25px;
          z-index: 10;
        }
        .dot-wrapper {
          position: relative;
          top: -20px;
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
             &.active {
               width: 20px;
               border-radius: 5px;
               background: #bbb;
             }  
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l {
              text-align: left;
            }
             &.time-r {
               text-align: right;
             }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: #ffcd32;
            &.disable {
              color: rgba(255, 205, 49, 0.5);
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left;
          }
          .icon-favorite {
            color: #d93f30;
          }
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: #333;
      .icon {
        flex: 0 0 40px;
        padding: 0 10px 0 20px;
        img {
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        height: 100%;
        line-height: 20px;
        overflow: hidden;
        .name {
          margin-bottom: 2px;
          font-weight: 400;
        }
      }
      .control {
        flex: 0 0 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 30px;
        }
        .icon-mini {
          font-size: 32px;
          left: 0;
          top: 0;
        }
      }
    }
    .normal-enter-active, .normal-leave-active {
      transition: all .4s;
      .top, .bottom {
        transition: all .4s cubic-bezier(.86, .18, .82, 1.32);
      }
    }
    .normal-enter, .normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
    .mini-enter-avtive, .mini-leave-active {
      transition: all .4s;
    }
    .mini-enter, .mini-leave-to {
      opacity: 0;
    }
  }
  .swiper-pagination ::v-deep .swiper-pagination-bullet-active {
    width: 15px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.8);
  }
  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
    
</style>