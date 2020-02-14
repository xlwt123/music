<template>
  <div class="search">
    <search-box ref="searchBox" @query="onQueryChange"></search-box>
    <div class="shortcut-wrapper w-100" v-show="!query" ref="wrapper">
      <scroll :data="searchHistory" class="shortcut h-100" ref="scroll"> 
        <div>
          <div class="hot-key p-3">
            <h1 class="title m-0 fs-m text-text-l py-2">热门搜索</h1>
            <ul class="m-0 p-0 d-flex flex-wrap">
              <li class="item fs-m mx-1 my-2 p-1 text-text-d bg-bg-h" v-for="(item, index) of hotKey" :key="index" @click="addQuery(item.first)">{{item.first}}</li>
            </ul>
          </div>
          <div class="history p-3">
            <div class="title fs-m text-text-l py-2 d-flex ai-center">
              <h1 class="fs-m flex-1">搜索历史</h1>
              <i class="iconfont icon-clear fs-m" @click="clearSearchHistory"></i>
            </div>
            <search-list :list="searchHistory" @selectItem="addQuery" @delectItem="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result w-100" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query" @listScroll="handleListScroll" @select="saveSearch"></suggest>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox'
import Suggest from '@/components/Suggest'
import SearchList from '@/components/SearchList'
import Scroll from '@/components/Scroll'
import searchApi from '../api/search'
import { ERR_OK } from "../api/config"
import { mapActions, mapGetters } from 'vuex'
import { playListMixin } from '../assets/js/mixin'
export default {
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll
  },
  mixins: [playListMixin],
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  methods: {
    _getHotKey() {
      searchApi.getHotKey().then(res => {
        if (res.status === ERR_OK) {
          this.hotKey = res.data.result.hots
        }
      })
    },
    addQuery(hotKey) {
      this.$refs.searchBox.query = hotKey
    },
    onQueryChange(newQuery) {
      this.query = newQuery
    },
    handleListScroll() {
      this.$refs.searchBox.inputBlur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.wrapper.style.bottom = bottom
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
  },
  watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20)
        }
      }
    },
  created() {
    this._getHotKey() 
  },
}
</script>

<style lang="scss" scoped>
.search {
  .shortcut-wrapper {
    position: fixed;
    top: 132px;
    bottom: 0;
    left: 0;
    .shortcut {
      overflow: hidden;
      .hot-key {
        ul {
          list-style: none;
          .item {
            border-radius: 5px;
          }
        }
      }
    }
    
  }
  .search-result {
    position: fixed;
    top: 132px;
    bottom: 0;
    left: 0;
  }
}
</style>