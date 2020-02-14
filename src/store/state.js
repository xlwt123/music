import { playMode } from '../assets/js/config'
import { getSearch } from '../assets/js/cache'

const state = {
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  searchHistory: getSearch()
}

export default state