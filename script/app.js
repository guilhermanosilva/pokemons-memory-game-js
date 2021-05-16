const CARD = 'card'
const FRONT = 'card-front'
const BACK = 'card-back'
let difficulty = 'normal'

const startGame = () => {
  const cards = game.createCards(difficulty)
  initializeNumberOfGames()
  initializeCards(cards)
  game.startTimer()
  showTimer()
  showClicksAndGame()
}

const initializeCards = (cards) => {
  const gameBoard = document.getElementById('gameBoard')
  gameBoard.innerHTML = ''
  gameBoard.className = difficulty

  cards.forEach(card => {
    let cardElement = document.createElement('div')
    cardElement.id = card.id
    cardElement.classList.add(CARD)
    cardElement.dataset.pokemon = card.name

    createCardContent(FRONT, card, cardElement)
    createCardContent(BACK, card, cardElement)

    cardElement.addEventListener('click', flipped)
    gameBoard.appendChild(cardElement)
  })
}

const createCardContent = (face, card, cardElement) => {
  let cardElementFace = document.createElement('div')
  cardElementFace.classList.add(face)

  if (face == FRONT) {
    let cardFaceFront = document.createElement('img')
    cardFaceFront.src = './images/' + card.name + '.jpg'
    cardElementFace.appendChild(cardFaceFront)
  } else {
    let cardFaceBack = document.createElement('img')
    cardFaceBack.src = './images/pokeball.png'
    cardElementFace.appendChild(cardFaceBack)
  }

  cardElement.appendChild(cardElementFace)
}

const flipped = event => {
  let current = event.currentTarget

  if (game.setCards(current.id)) {
    current.classList.add('flip')
    showClicksAndGame()
  }

  if (game.secondCard) {
    if (game.checkMatch()) {
      if (game.checkWinner(difficulty)) {
        const gameOverLayer = document.querySelector('#gameFinish')
        gameOverLayer.style.display = 'flex'
        listScore()
        saveDataInLocalstorage()
        togglePlayPauseGame()
      }
      game.clearCards()
    } else {
      setTimeout(() => {
        let firstCardDOM = document.getElementById(game.firstCard.id)
        let secondCardDOM = document.getElementById(game.secondCard.id)

        firstCardDOM.classList.remove('flip')
        secondCardDOM.classList.remove('flip')
        game.unflipCards()
      }, 1000)
    }
  }
}

const restartGame = () => {
  const gameContainer = document.getElementsByClassName('game')[0]
  const gameOverLayer = document.querySelector('#gameFinish')

  gameContainer.style.filter = 'none'
  gameOverLayer.style.display = 'none'

  game.clicks = 0
  game.clearTimer()
  game.togglePlayPauseTime()
  togglePlayPauseButton()
  startGame()
}

const prepareDataToSave = () => {
  const localData = JSON.parse(localStorage.getItem('dataGame'))

  const dataGame = {
    allGames: game.game,
    clicks: game.clicks,
    timer: game.formatTime(game.currentTimer),
    difficulty: difficulty,
  }

  if (difficulty == 'easy') dataGame.games = game.gameEasy
  if (difficulty == 'normal') dataGame.games = game.gameNormal
  if (difficulty == 'hard') dataGame.games = game.gameHard

  if (!localData) {
    const localData = []
    localData.unshift(dataGame)
    return localData
  }

  localData.unshift(dataGame)

  return localData
}

const saveDataInLocalstorage = () => {
  const localData = prepareDataToSave()
  localStorage.setItem('dataGame', JSON.stringify(localData))
}

const getDataFromLocalstrage = () => {
  return JSON.parse(localStorage.getItem('dataGame'))
}

const showTimer = () => {
  if (!game.currentTimer) {
    const clock = document.getElementById('clock')
    setInterval(() => {
      clock.innerHTML = ''
      clock.innerHTML = game.currentTimer
    }, 1000)
  }

}

const showClicksAndGame = () => {
  const data = getDataFromLocalstrage()
  const currentPoints = document.getElementById('currentPoints')
  let currentGame = null

  if (data) {
    currentGame = data.filter(games => games.difficulty == difficulty)
  }
  currentPoints.innerHTML = `
    <span># ${currentGame && currentGame.length > 0 ? currentGame[0].games + 1 : '1'}</span>
    <span>${game.clicks}</span>
    `
}

const initializeNumberOfGames = () => {
  const data = getDataFromLocalstrage()

  if (data) {
    const currentGame = data.filter(games => games.difficulty == difficulty)
    game.game = data[0].allGames

    game.gameEasy = (difficulty == 'easy' && currentGame.length > 0)
      ? currentGame[0].games
      : 0

    game.gameNormal = (difficulty == 'normal' && currentGame.length > 0)
      ? currentGame[0].games
      : 0

    game.gameHard = (difficulty == 'hard' && currentGame.length > 0)
      ? currentGame[0].games
      : 0
  }
}

const listScore = () => {
  const data = getDataFromLocalstrage()
  const easyScore = data.filter(point => point.difficulty == 'easy')
  const normalScore = data.filter(point => point.difficulty == 'normal')
  const hardScore = data.filter(point => point.difficulty == 'hard')

  const easyPoints = document.getElementById('easyPoints')
  const normalPoints = document.getElementById('normalPoints')
  const hardPoints = document.getElementById('hardPoints')

  easyPoints.innerHTML = ''
  normalPoints.innerHTML = ''
  hardPoints.innerHTML = ''

  easyScore.map(easy => {
    easyPoints.innerHTML += `
    <div class="lineScore containerData">
      <span># ${easy.games}</span>
      <span>${easy.clicks}</span>
      <span>${easy.timer}</span>
    </div>
    `
  })

  normalScore.map(normal => {
    normalPoints.innerHTML += `
    <div class="lineScore">
      <span># ${normal.games}</span>
      <span>${normal.clicks}</span>
      <span>${normal.timer}</span>
    </div>
    `
  })

  hardScore.map(hard => {
    hardPoints.innerHTML += `
    <div class="lineScore">
      <span># ${hard.games}</span>
      <span>${hard.clicks}</span>
      <span>${hard.timer}</span>
    </div>
    `
  })
}

const toggleBgBlur = () => {
  const gameContainer = document.getElementsByClassName('game')[0]

  if (gameContainer.style.filter == 'none') {
    gameContainer.style.filter = 'blur(4px)'
  } else {
    gameContainer.style.filter = 'none'
  }
}

const togglePlayPauseButton = () => {
  const btnPlayPause = document.getElementById('btnPlayPause')
  if (btnPlayPause.className == 'pause') {
    btnPlayPause.className = 'play'
  } else {
    btnPlayPause.className = 'pause'
  }
}

const togglePlayPauseGame = () => {
  game.togglePlayPauseTime()
  togglePlayPauseButton()
  toggleBgBlur()
}

const activeButtons = () => {
  difficultyBtn.forEach((btn) => {
    btn.disabled = false
  })
}

const btnReturnGame = document.getElementById('returnGame')
btnReturnGame.addEventListener('click', () => {
  const gamePaused = document.getElementById('gamePaused')
  gamePaused.style.display = 'none'
  togglePlayPauseGame()
})

const difficultyBtn = document.querySelectorAll('.difficultyBtn')
difficultyBtn.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    activeButtons()
    btn.disabled = true
    difficulty = e.target.id
  })
})

const buttonContainer = document.getElementsByClassName('buttonContainer')[0]
buttonContainer.addEventListener('click', () => {
  const gamePaused = document.getElementById('gamePaused')
  gamePaused.style.display = 'flex'
  togglePlayPauseGame()
})

const btnPlayAgain = document.querySelector('#playAgain')
btnPlayAgain.addEventListener('click', restartGame)

const btnStartGame = document.getElementById('btnStartGame')
btnStartGame.addEventListener('click', () => {
  const initialScreen = document.getElementById('initialScreen')
  initialScreen.style.display = 'none'
  restartGame()
})

const btnNewGame = document.getElementById('btnNewGame')
btnNewGame.addEventListener('click', () => {
  const alert = document.getElementsByClassName('containerAlert')[0]
  alert.style.display = 'flex'
  togglePlayPauseGame()
})

const alertButtons = document.querySelectorAll('.containerAlertButtons button')
alertButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const initialScreen = document.getElementById('initialScreen')
    const alert = document.getElementsByClassName('containerAlert')[0]
    if (btn.id == 'btnNo') {
      alert.style.display = 'none'
      togglePlayPauseGame()
    }
    if (btn.id == 'btnOk') {
      alert.style.display = 'none'
      initialScreen.style.display = 'flex'
      game.clearTimer()
    }
  })
})

startGame()