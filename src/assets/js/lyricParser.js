const timeExp = /\[(\d{2,}):(\d{2,3})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

function noop() {}

export default class Lyric {
  constructor(lrc, handler = noop) {
    this.lrc = lrc
    this.tags = {}
    this.lines = []
    this.handler = handler
    this.state = STATE_PAUSE
    this.curLine = 0

    this._init()
  } 

  _init() {
    this._initTag()
    this._initLines()
  }

  _initTag() {
    for (let tag in tagRegMap) {
      const matchs = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)`, 'i'))
      this.tags[tag] = matchs && matchs[1] || ''
    }
  }

  _initLines() {
    const lines = this.lrc.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let results = []
      let result
      while ((result = timeExp.exec(line))) {
        results.push(result)
      } 
      // let result = [...line.matchAll(timeExp)]
      if (results) {
        const txt = line.replace(timeExp, '').trim()
        if (txt) {
          for (let i = 0; i < results.length; i++) {
            let thirdResult = results[i][3] || '0'
            let length = thirdResult.length
            let _thirdResult = parseInt(thirdResult, 10)
            _thirdResult = length > 2 ? _thirdResult : _thirdResult * 10
            this.lines.push({
              time: results[i][1] * 1000 * 60 + results[i][2] * 1000 + _thirdResult,
              txt
            })
          }
        }
      }
    }
    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }

  _findCurNum(time) {
    for(let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }

  _callHandler(i) {
    if (i < 0) {
      return 
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }

  _playRest() {
    let line = this.lines[this.curNum]
    // 根据歌词中带有的时间信息，计算出下一次歌词变更的时间间隔
    let delay = line.time - (+new Date() - this.startStamp)

    this.timer = setTimeout(() => {
        this._callHandler(this.curNum++)
        if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
            // 只要处于播放状态中，重复调用这个函数
            this._playRest()
        }
    }, delay)
  }

  play(startTime = 0, skipLast) {
    if (!this.lines.length) {
        return
    }
    // 修改播放状态
    this.state = STATE_PLAYING
    // 记录下播放开始瞬间的歌词当前值和时间戳
    this.curNum = this._findCurNum(startTime)
    this.startStamp = +new Date() - startTime

    if (!skipLast) {
        this._callHandler(this.curNum - 1)
    }

    if (this.curNum < this.lines.length) {
        clearTimeout(this.timer)
        this._playRest()
    }
  }

  togglePlay() {
    var now = +new Date()
    if (this.state === STATE_PLAYING) {
        this.stop()
        // 记录下暂停的时间戳
        this.pauseStamp = now
    } else {
        this.state = STATE_PLAYING
        // 如果是第一次播放，传入 0
        // 如果是从暂停处播放，就传入已经播放完的进度时间
        this.play((this.pauseStamp || now) - (this.startStamp || now), true)
    }
  }

  stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }

  seek(offset) {
    this.play(offset)
  }
}
