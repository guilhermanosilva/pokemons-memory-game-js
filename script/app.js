const CARD = 'card'
const FRONT = 'card-front'
const BACK = 'card-back'
let difficulty = 'normal'
let timerInterval = null
let pauseTimer = true

const startGame = () => {
  const cards = game.createCards(difficulty)
  initializeNumberOfGames()
  initializeCards(cards)
  startTimer()
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
        saveDataInLocalstorage()
        const gameBoard = document.querySelector('#gameBoard')
        const gameOverLayer = document.querySelector('#gameFinish')
        gameBoard.style.filter = 'blur(4px)'
        gameOverLayer.style.display = 'flex'
        pauseTimer = true
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
  const gameBoard = document.querySelector('#gameBoard')
  const gameOverLayer = document.querySelector('#gameFinish')
  const btnPlayPause = document.getElementById('btnPlayPause')
  game.clicks = 0
  gameBoard.style.filter = 'none'
  gameOverLayer.style.display = 'none'
  btnPlayPause.classList.remove('play')
  btnPlayPause.classList.add('pause')
  pauseTimer = false
  clearTimer()
  startGame()
}

const prepareDataToSave = () => {
  const localData = JSON.parse(localStorage.getItem('dataGame'))

  const dataGame = {
    allGames: game.game,
    clicks: game.clicks,
    timer: game.currentTimer,
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

const startTimer = () => {
  let allSeconds = 0
  let s = 0
  let m = 0
  let h = 0

  timerInterval = setInterval(() => {
    if (!pauseTimer) {
      allSeconds++
    }

    s = allSeconds
    if (allSeconds >= 60) {
      s = allSeconds % 60
    }

    m = parseInt(allSeconds / 60)
    if (m >= 60) {
      m = allSeconds % 60
    }

    h = parseInt(allSeconds / 3600)

    game.currentTimer = `0${h}:0${m}:0${s}`
  }, 1000)
}

const clearTimer = () => {
  if (!timerInterval) {
    return
  }
  game.currentTimer = '00:00:00'
  clearInterval(timerInterval)
}

const formatTime = (timer) => {
  if (timer) {
    const gameTime = timer.split(':')
    gameTime.forEach((time, i) => {
      const subTime = time.substr(-2)
      gameTime[i] = subTime
    })
    return gameTime.join(':')
  }

}

const activeButtons = () => {
  difficultyBtn.forEach((btn) => {
    btn.disabled = false
  })
}

const showTimer = () => {
  if (!game.currentTimer) {
    const clock = document.getElementById('clock')
    setInterval(() => {
      clock.innerHTML = ''
      let timer = formatTime(game.currentTimer)
      clock.innerHTML = timer
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

const gameResume = () => {
  const screenPause = document.getElementById('gamePaused')
  screenPause.style.display = 'flex'
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

const btnReturnGame = document.getElementById('returnGame')
btnReturnGame.addEventListener('click', () => {
  const screenPause = document.getElementById('gamePaused')
  screenPause.style.display = 'none'
  btnPlayPause.classList.remove('play')
  btnPlayPause.classList.add('pause')
  pauseTimer = false
})


const difficultyBtn = document.querySelectorAll('.difficultyBtn')
difficultyBtn.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    activeButtons()
    btn.disabled = true
    difficulty = e.target.id
    restartGame()
  })
})

const btnPlayPause = document.getElementById('btnPlayPause')
btnPlayPause.addEventListener('click', () => {
  if (btnPlayPause.classList[1] == 'play') {
    btnPlayPause.classList.remove('play')
    btnPlayPause.classList.add('pause')
    pauseTimer = false
  } else {
    btnPlayPause.classList.remove('pause')
    btnPlayPause.classList.add('play')
    pauseTimer = true
    gameResume()
  }
})

const restart = document.querySelector('#restartGame')
restart.addEventListener('click', restartGame)

const btnStartGame = document.getElementById('btnStartGame')
btnStartGame.addEventListener('click', () => {
  const initialScreen = document.getElementById('initialScreen')
  initialScreen.style.display = 'none'
  btnPlayPause.classList.remove('play')
  btnPlayPause.classList.add('pause')
  pauseTimer = false
})

startGame()