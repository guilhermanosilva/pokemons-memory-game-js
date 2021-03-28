let game = {
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
    'vulpix',
  ],

  createCards: function () {
    let cards = this.pokemons.map((pokemon) => {
      return this.createPairFromCards(pokemon);
    });

    cards = cards.flatMap((card) => card);

    this.shuffleCards(cards);

    return cards;
  },

  createPairFromCards: function (pokemon) {
    return [
      {
        id: this.generateId(pokemon),
        name: pokemon,
        fippled: false,
      },
      {
        id: this.generateId(pokemon),
        name: pokemon,
        fippled: false,
      },
    ];
  },

  generateId: function (pokemon) {
    return pokemon + Math.floor(Math.random() * 10000);
  },

  shuffleCards: function (cards) {
    let currentIndex = 0;
    let randomIndex = 0;

    while (currentIndex !== cards.length) {
      randomIndex = Math.floor(Math.random() * currentIndex);

      [cards[currentIndex], cards[randomIndex]] = [
        cards[randomIndex],
        cards[currentIndex],
      ];

      currentIndex++;
    }
  },
};
