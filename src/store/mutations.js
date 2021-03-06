import * as types from './mutation-types'

const mutations = {
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_SONG_LYRIC](state, lyric) {
    let currentSong = state.playList[state.currentIndex]
    currentSong.lyric = lyric
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  }
}

export default mutations