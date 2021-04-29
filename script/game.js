let game = {
  cards: null,
  lockMode: false,
  firstCard: null,
  secondCard: null,
  clicks: 0,
  game: 0,
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

  createCards: function () {
    this.cards = this.pokemons.map(pokemon => {
      return this.createPairFromCards(pokemon)
    })

    this.cards = this.cards.flatMap(card => card)

    this.shuffleCards(this.cards)

    return this.cards
  },

  createPairFromCards: function (pokemon) {
    return [
      {
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
      randomIndex = Math.floor(Math.random() * currentIndex)
      ;[cards[currentIndex], cards[randomIndex]] = [
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

  checkWinner: function () {
    const winner = this.cards.filter(card => !card.flipped).length == 0
    if(winner){
      this.game++
    }
    return winner
  }
}
