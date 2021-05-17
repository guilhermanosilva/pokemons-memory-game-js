let time = {

  pauseTimer: true,
  timerInterval: null,
  currentTimer: null,

  format: function (timer) {
    if (timer) {
      const gameTime = timer.split(':')

      gameTime.forEach((time, i) => {
        const subTime = time.substr(-2)
        gameTime[i] = subTime
      })

      return gameTime.join(':')
    } else {
      return '00:00:00'
    }
  },

  start: function () {
    let allSeconds = 0
    let s = 0
    let m = 0
    let h = 0

    this.timerInterval = setInterval(() => {
      s = allSeconds
      m = parseInt(allSeconds / 60)
      h = parseInt(allSeconds / 3600)

      if (!this.pauseTimer) {
        allSeconds++
      }

      if (allSeconds >= 60) {
        s = allSeconds % 60
      }

      if (m >= 60) {
        m = allSeconds % 60
      }

      this.currentTimer = `0${h}:0${m}:0${s}`
    }, 1000)
  },

  clear: function () {
    if (!this.timerInterval) {
      return
    }

    clearInterval(this.timerInterval)
    this.currentTimer = '00:00:00'
  },

  togglePlayPauseTime: function () {
    if (this.pauseTimer == false) {
      this.pauseTimer = true
    } else {
      this.pauseTimer = false
    }
  },

}