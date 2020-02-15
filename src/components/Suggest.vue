<template>
  <scroll class="suggest h-100" :data="searchResult" :pullup="true" @scrollToEnd="loadMore" :beforeScroll="true" @beforeScroll="listScroll" ref="scroll">
    <ul class="suggest-list m-0 p-3">
      <li class="suggest-item d-flex ai-center" v-for="(item,index) of searchResult" :key="index" @click="selectItem(item)">
        <div class="icon text-text-d pl-2 pr-2">
          <i class="iconfont" :class="getIconClass(item)"></i>
        </div>
        <div class="name flex-1 pl-2">
          <p class="text text-text-d fs-m" v-html="getInfo(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
      <no-result title="抱歉，暂无搜索结果" v-show="!hasMore&&!searchResult.length"></no-result>
    </ul>
  </scroll>
</template>

<script>
import searchApi from '../api/search'
import albumApi from '../api/album'
import songApi from '../api/song'
import { ERR_OK } from "../api/config"
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'
import NoResult from '@/components/NoResult'
import { playListMixin } from '../assets/js/mixin'
import { mapActions } from 'vuex'

const TYPE_SINGER = 'singer'

export default {
  components: {
    Scroll,
    Loading,
    NoResult
  },
  mixins: [playListMixin],
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchResult: [],
      hasMore: true,
      offset: 0
    }
  },
  methods: {
    _getMultimatch(query) {
      searchApi.getMultimatch(query).then(res => {
        if (res.status === ERR_OK) {
          if (res.data.result.artist) {
            res.data.result.artist.forEach(item => {
              item.type = TYPE_SINGER
              this.searchResult.push(item)
            })
          }
        }
      })
    },
    _getSearch(query) {
      this.hasMore = true
      searchApi.getSearch(query, this.offset).then(res => {
        if (res.status === ERR_OK) {
          if (res.data.result.songs) {
            this.searchResult = this.searchResult.concat(res.data.result.songs)
            this.offset += 30
          }
          this.checkHasMore(res.data.result.songCount)
        }
      })
    },
    loadMore() {
      if (!this.hasMore) {
        return 
      }
      this._getSearch(this.query)
    },
    checkHasMore(count) {
      if (count <= this.offset) {
        this.hasMore = false
      }
    },
    selectItem(item) {
      this.$emit('select')
      if (item.type === TYPE_SINGER) {
        // console.log('toSinger')
      } else {
        let song = item
        this.completeSong(song)
        this.insertSong(song)
      }
    },
     handlePlayList() {
      this.$refs.scroll.refresh()
    },
    completeSong(song) {
      songApi.getSongUrl(song.id).then(res => {
        if (res.status === ERR_OK) {
          song.url = res.data.data[0].url
        }
      })
      albumApi.getAlbum(song.album.id).then(res => {
        if (res.status === ERR_OK) {
          song.album = res.data.album
        }
      })
    },
    listScroll() {
      this.$emit('listScroll')
    },
    getIconClass(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getInfo(item) {
      if (item.type === TYPE_SINGER) {
        return item.name
      } else {
        return `${item.name}&nbsp;-&nbsp;${this.artistsList(item.artists)}`
      }
    },
    artistsList(arr) {
      let result = []
      arr.forEach(item => {
        result.push(item.name)
      })
      return result.join('/')
    },
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query(newQuery) {
      this.searchResult = []
      this.offset = 0
      if (newQuery) {
        this._getMultimatch(newQuery)
        setTimeout(() => {
          this._getSearch(newQuery)
        }, 60)
      } 
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  overflow: hidden;
  .suggest-list {
    list-style: none;
  }
}
</style>