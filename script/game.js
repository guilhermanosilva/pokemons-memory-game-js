let game = {
  cards: null,
  lockMode: false,
  firstCard: null,
  secondCard: null,
  currentTimer: null,
  clicks: 0,
  game: 0,
  gameEasy: 0,
  gameNormal: 0,
  gameHard: 0,
  pauseTimer: true,
  timerInterval: null,
  pokemons: [
    'bulbasaur',
    'butterfree',
    'charmander',
    'jigglypuff',
    'meowth',
    'pidgeotto',
    'pikachu',
    'psyduck',
    'squirtle',
    'vulpix'
  ],

  createCards: function (diff) {
    let newPokemons = this.difficultyCards(diff)

    this.cards = newPokemons.map(pokemon => {
      return this.createPairFromCards(pokemon)
    })

    this.cards = this.cards.flatMap(card => card)

    this.shuffleCards(this.cards)

    return this.cards
  },

  createPairFromCards: function (pokemon) {
    return [{
      id: this.generateId(pokemon),
      name: pokemon,
      flipped: false
    },
    {
      id: this.generateId(pokemon),
      name: pokemon,
      flipped: false
    }
    ]
  },

  generateId: function (pokemon) {
    return pokemon + Math.floor(Math.random() * 10000)
  },

  shuffleCards: function (cards) {
    let currentIndex = 0
    let randomIndex = 0

    while (currentIndex !== cards.length) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      [cards[currentIndex], cards[randomIndex]] = [
        cards[randomIndex],
        cards[currentIndex]
      ]

      currentIndex++
    }
  },

  setCards: function (id) {
    let card = this.cards.filter(card => card.id === id)[0]
    if (this.lockMode || card.flipped) {
      return false
    }

    if (!this.firstCard) {
      this.firstCard = card
      this.firstCard.flipped = true
      this.clicks++
      return true
    } else {
      this.secondCard = card
      this.secondCard.flipped = true
      this.lockMode = true
      this.clicks++
      return true
    }
  },

  checkMatch: function () {
    if (!this.firstCard || !this.secondCard) {
      return false
    }
    return this.firstCard.name === this.secondCard.name
  },

  clearCards: function () {
    this.firstCard = null
    this.secondCard = null
    this.lockMode = false
  },

  unflipCards: function () {
    this.firstCard.flipped = false
    this.secondCard.flipped = false
    this.clearCards()
  },

  checkWinner: function (diff) {
    const winner = this.cards.filter(card => !card.flipped).length == 0
    if (winner) {
      this.game++
      if (diff == 'easy') this.gameEasy++
      if (diff == 'normal') this.gameNormal++
      if (diff == 'hard') this.gameHard++
    }
    return winner
  },

  difficultyCards: function (diff) {
    if (diff == 'easy') {
      return this.pokemons.slice(0, 6)
    }
    if (diff == 'normal') {
      return this.pokemons.slice(0, 8)
    }
    if (diff == 'hard') {
      return this.pokemons
    }
    if (diff !== 'easy' && diff !== 'normal' && diff !== 'hard') {
      return this.pokemons
    }
  },

  formatTime: function (timer) {
    if (timer) {
      const gameTime = timer.split(':')
      gameTime.forEach((time, i) => {
        const subTime = time.substr(-2)
        gameTime[i] = subTime
      })
      return gameTime.join(':')
    }
  },

  startTimer: function () {
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

      let time = `0${h}:0${m}:0${s}`

      this.currentTimer = this.formatTime(time)

    }, 1000)
  },

  clearTimer: function () {
    if (!this.timerInterval) {
      return
    }

    this.currentTimer = '00:00:00'
    clearInterval(this.timerInterval)
  },

  togglePlayPauseTime: function () {
    if (this.pauseTimer == false) {
      this.pauseTimer = true
    } else {
      this.pauseTimer = false
    }
  }
}
