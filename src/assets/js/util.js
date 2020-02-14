export function shuffle(arr, index) {
  let newArr = arr.concat()
  for (let i = 0; i < newArr.length; i++) {
    let j = getRandomIndex(0, i)
    if (i === index || j === index) {
      continue
    }
    let temp = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = temp
  }
  return newArr
}

function getRandomIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function throttle(fun, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, delay)
  }
}

export function format(interval) {
  interval = Math.floor(interval)
  const min = Math.floor(interval / 60)
  const sec = _pad(Math.floor(interval % 60))
  return `${min}:${sec}`
}

function _pad(num, n = 2) {
  let length = num.toString().length
  while (length < n) {
    num = '0' + num
    length++
  }
  return num
}