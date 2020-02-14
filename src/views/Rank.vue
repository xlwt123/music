<template>
  <div class="rank" ref="rank">
    <scroll class="rank-content w-100 h-100" :data="otherList" ref="scroll">
      <div class="wrapper">
        <div class="detail-rank">
          <h2 class="list-title text-theme fs-xm pl-2 mt-2 m-0">官方榜单</h2>
          <div class="list-content p-2 d-flex" v-for="item of detailList" :key="item.id" @click="toDetail(item.id)">
            <img :src="item.coverImgUrl" alt="item.name">
            <div class="list-detail p-2">
              <div class="list text-ellipsis fs-m" v-for="(list, index) of item.tracks" :key="index">
                <span class="pr-2">{{index + 1}}</span>
                <span class="">{{list.first}} - {{list.second}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="other-rank">
          <h2 class="list-title text-theme fs-xm pl-2 mt-2 m-0">其他榜单</h2>
          <play-list-content :list="otherList"></play-list-content>
        </div>
      </div>
      
    </scroll>
  </div>
</template>

<script>
import { ERR_OK } from "../api/config"
import topListApi from "../api/topList"
import Scroll from '@/components/Scroll'
import PlayListContent from '@/components/PlayListContent'
import { playListMixin } from '../assets/js/mixin'
export default {
  components: {
    Scroll,
    PlayListContent
  },
  mixins: [playListMixin],
  data() {
    return {
      detailList: [],
      otherList: []
    }
  },
  methods: {
    _getTopListDetail() {
      topListApi.getTopListDetail().then(res => {
        if (res.status === ERR_OK) {
          this.separateList(res.data.list)
        }
      })
    },
    separateList(arr) {
      arr.forEach(item => {
        if (item.tracks.length > 0) {
          this.detailList.push(item)
        } else {
          this.otherList.push(item)
        }
      })
    },
    toDetail(id) {
      this.$router.push(`/playlist/${id}`)
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
  },
  created() {
    this._getTopListDetail() 
  }
}
</script>

<style lang="scss" scoped>
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

.rank {
  position: fixed;
  top: 92px;
  left: 0;
  bottom: 0;
  width: 100%;
  .rank-content {
    overflow: hidden;
    img {
      border-radius: 5px;
      height: 120px;
    }
    .detail-rank {
      position: relative;
      .list {
        line-height: 32px;
        width: 90%;
      }
    }
    .other-rank {
      position: relative;
    }
  }
}
</style>