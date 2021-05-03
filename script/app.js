const CARD = 'card'
const FRONT = 'card-front'
const BACK = 'card-back'
let difficulty = 'normal'

const startGame = () => {
  const cards = game.createCards(difficulty)
  initializeCards(cards)
  timer()
  showTimer()
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
  }

  if (game.secondCard) {
    if (game.checkMatch()) {
      if (game.checkWinner()) {
        saveDataInLocalstorage()
        const gameBoard = document.querySelector('#gameBoard')
        const gameOverLayer = document.querySelector('#gameFinish')
        gameBoard.style.filter = 'blur(4px)'
        gameOverLayer.style.display = 'flex'
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
  gameBoard.style.filter = 'none'
  gameOverLayer.style.display = 'none'
  startGame()
}

const prepareDataToSave = () => {
  const localData = JSON.parse(localStorage.getItem('dataGame'))

  const dataGame = {
    game: game.game,
    clicks: game.clicks,
    timer: game.currentTimer,
    difficulty: difficulty
  }

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

const timer = () => {
  let allSeconds = 0
  let s = 0
  let m = 0
  let h = 0

  setInterval(() => {

    allSeconds++

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

const formatTime = (timer) => {
  const gameTime = timer.split(':')
  gameTime.forEach((time, i) => {
    const subTime = time.substr(-2)
    gameTime[i] = subTime
  })
  return gameTime.join(':')

}

const activeButtons = () => {
  difficultyBtn.forEach((btn) => {
    btn.disabled = false
  })
}

const showTimer = () => {
  if (!game.currentTimer) {
    const clock = document.getElementsByClassName('clock')[0]
    setInterval(() => {
      clock.innerHTML = ''
      let timer = formatTime(game.currentTimer)
      clock.innerHTML = timer
    }, 1000)
  }

}

const difficultyBtn = document.querySelectorAll('.difficultyBtn')
difficultyBtn.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    activeButtons()
    btn.disabled = true
    difficulty = e.target.innerHTML
    restartGame(e.target.innerHTML)
  })
})

const restart = document.querySelector('#restartGame')
restart.addEventListener('click', restartGame)

startGame()