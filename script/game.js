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
};
