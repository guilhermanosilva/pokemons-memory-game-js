const CARD = 'card'
const FRONT = 'card-front'
const BACK = 'card-back'

const startGame = () => {
  const cards = game.createCards()

  if (game.timerInterval != null) {
    game.clearTimer()
  }

  initializeCards(cards)
  showTimer()
  initializeNumberOfGames()
  showClicksAndGame()
}

const initializeCards = (cards) => {
  const gameBoard = document.getElementById('gameBoard')
  gameBoard.innerHTML = ''
  gameBoard.className = game.difficulty

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
    game.prepareDataToSave()
  }

  if (game.secondCard) {
    if (game.checkMatch()) {
      if (game.checkWinner()) {
        const gameOverLayer = document.querySelector('#gameFinish')
        gameOverLayer.style.display = 'flex'
        game.saveDataInLocalstorage()
        togglePlayPauseGame()
        listScore()
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
  time.togglePlayPauseTime()
  togglePlayPauseButton()
  startGame()
}

const getDataFromLocalstrage = () => {
  return JSON.parse(localStorage.getItem('dataGame'))
}

const showTimer = () => {
  const clock = document.getElementById('clock')
  setInterval(() => {
    clock.innerHTML = ''
    clock.innerHTML = time.format(time.currentTimer)
  }, 1000)
}

const showClicksAndGame = () => {
  const data = getDataFromLocalstrage()
  const currentPoints = document.getElementById('currentPoints')
  let currentGame = null

  if (data) {
    currentGame = data.filter(games => games.difficulty == game.difficulty)
  }
  currentPoints.innerHTML = `
    <span># ${currentGame && currentGame.length > 0 ? currentGame[0].games + 1 : '1'}</span>
    <span>${game.clicks}</span>
    `
}

const initializeNumberOfGames = () => {
  const data = getDataFromLocalstrage()

  if (data) {
    const currentGame = data.filter(games => games.difficulty == game.difficulty)
    game.game = data[0].allGames

    game.gameEasy = (game.difficulty == 'easy' && currentGame.length > 0)
      ? currentGame[0].games
      : 0

    game.gameNormal = (game.difficulty == 'normal' && currentGame.length > 0)
      ? currentGame[0].games
      : 0

    game.gameHard = (game.difficulty == 'hard' && currentGame.length > 0)
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
  time.togglePlayPauseTime()
  togglePlayPauseButton()
  toggleBgBlur()
}

const activeButtons = () => {
  difficultyBtn.forEach((btn) => {
    btn.disabled = false
  })
}

const returnGameBtn = document.getElementById('returnGame')
returnGameBtn.addEventListener('click', () => {
  const gamePaused = document.getElementById('gamePaused')
  gamePaused.style.display = 'none'
  togglePlayPauseGame()
})

const difficultyBtn = document.querySelectorAll('.difficultyBtn')
difficultyBtn.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    activeButtons()
    btn.disabled = true
    game.difficulty = e.target.id
  })
})

const pauseGameBtn = document.getElementsByClassName('buttonContainer')[0]
pauseGameBtn.addEventListener('click', () => {
  togglePlayPauseGame()
  const gamePaused = document.getElementById('gamePaused')
  gamePaused.style.display = 'flex'
})

const btnPlayAgain = document.querySelector('#playAgain')
btnPlayAgain.addEventListener('click', restartGame)

const startGameBtn = document.getElementById('btnStartGame')
startGameBtn.addEventListener('click', () => {
  const initialScreen = document.getElementById('initialScreen')
  initialScreen.style.display = 'none'
  time.start()
  restartGame()
})

const newGameBtn = document.getElementById('btnNewGame')
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
      time.clear()
      alert.style.display = 'none'
      initialScreen.style.display = 'flex'
    }
  })
})

startGame()