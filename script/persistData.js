const persistData = {
  prepareDataToSave: function () {
    const localData = JSON.parse(localStorage.getItem('dataGame'))

    const dataGame = {
      allGames: game.game,
      clicks: game.clicks,
      timer: time.format(time.currentTimer),
      difficulty: game.difficulty,
    }

    if (game.difficulty == 'easy') dataGame.games = game.gameEasy
    if (game.difficulty == 'normal') dataGame.games = game.gameNormal
    if (game.difficulty == 'hard') dataGame.games = game.gameHard

    if (!localData) {
      const localData = []
      localData.unshift(dataGame)
      return localData
    }

    localData.unshift(dataGame)

    return localData
  },

  saveDataInLocalstorage: function () {
    const localData = this.prepareDataToSave()
    localStorage.setItem('dataGame', JSON.stringify(localData))
  }
}