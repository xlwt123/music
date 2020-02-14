<template>
  <div class="recommend" ref="recommend">
    <scroll :data="newSongList" class="scroll-wrapper w-100 h-100" ref="scroll">
      <div class="wrapper-content">
        <swiper :options="swiperOption" ref="mySwiper" v-if="banners.length">
          <swiper-slide v-for="banner of banners" :key="banner.bannerId">
            <a :href="banner.url">
              <img :src="banner.pic" :alt="banner.typeTitle" class="w-100" />
            </a>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="play-list">
          <h2 class="list-title text-theme fs-xm pl-2 mt-2 m-0">推荐歌单</h2>
          <play-list-content :list="playLists"></play-list-content>
          <loading v-show="!playLists.length"></loading>
          <div class="list-more text-center">
            <button @click="handlePlayListMore" class="more-button text-theme fs-m">查看更多</button>
          </div>
        </div>
        <div class="newSong">
          <h2 class="list-title text-theme fs-xm pl-2 mt-2 m-0">新歌推荐</h2>
          <song-list :list="newSongList" class="mt-3"></song-list>
          <loading v-show="!newSongList.length"></loading>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
// @ is an alias to /src
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper"
import SongList from '@/components/SongList'
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'
import PlayListContent from '@/components/PlayListContent'
import { ERR_OK } from "../api/config"
import recommendApi from "../api/recommend"
import { playListMixin } from '../assets/js/mixin'

export default {
  name: "recommend",
  mixins: [playListMixin],
  components: {
    swiper,
    swiperSlide,
    SongList,
    PlayListContent,
    Scroll,
    Loading
  },
  data() {
    return {
      swiperOption: {
        autoplay: {
          delay: 3500,
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        loop: true,
        pagination: {
          el: ".swiper-pagination"
        }
      },
      banners: [],
      playLists: [],
      newSongList: []
    }
  },
  methods: {
    _getBanner() {
      recommendApi.getBanner().then(res => {
        if (res.status === ERR_OK) {
          this.banners = res.data.banners
        }
      })
    },
    _getPlayList() {
      recommendApi.getPlayList().then(res => {
        if (res.status === ERR_OK) {
          this.playLists = res.data.result
        }
      })
    },
    _getNewSongList() {
      recommendApi.getNewSong().then(res => {
        if (res.status === ERR_OK) {
          this.newSongList = this.normalizeNewSong(res.data.result)
        }
      })
    },
    handlePlayListMore() {
      this.$router.push('/playlist')
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    normalizeNewSong(arr) {
      let list = []
      arr.forEach(item => {
        list.push(item.song)
      })
      return list
    }
  },
  created() {
    this._getBanner()
    this._getPlayList()
    this._getNewSongList()
  }
};
</script>

<style lang="scss" scoped>
.swiper-pagination ::v-deep .swiper-pagination-bullet-active {
  width: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
}
.list-title {
  height: 35px;
  line-height: 35px;
}
.list-title::before {
  content: ' ';
  position: absolute;
  width: 2px;
  height: 25px;
  left: 0;
  top: 5px;
  background-color: #ffcd32;
}

.recommend {
  position: fixed;
  top: 92px;
  left: 0;
  bottom: 0;
  width: 100%;
  .scroll-wrapper {
    overflow: hidden;
    .play-list {
      position: relative;
      font-weight: lighter;
      .more-button {
        width: 100px;
        height: 35px;
        display: inline-block;
        border: 2px solid #ffcd32;
        background: transparent;
        border-radius: 15px;
      }
    }
    .newSong {
      position: relative;
      font-weight: lighter;
    }
  }
}


</style>
