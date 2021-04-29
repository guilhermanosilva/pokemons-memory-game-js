const CARD = 'card'
const FRONT = 'card-front'
const BACK = 'card-back'

const startGame = () => {
  initializeCards(game.createCards())
  timer()
}

const initializeCards = cards => {
  const gameBoard = document.getElementById('gameBoard')
  gameBoard.innerHTML = ''

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
        setDataInLocalStorage()
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

const setDataInLocalStorage = () => {
  const localData = JSON.parse(localStorage.getItem('dataGame'))

  if (!localData) {
    const localData = []
    setItem(localData)
  } else {
    setItem(localData)
  }
}

// Adds clicks to local storage
const setItem = (localData) => {
  localData.unshift({
    game: game.game,
    clicks: game.clicks,
    timer: formatTime(game.currentTimer)
  })
  localStorage.setItem('dataGame', JSON.stringify(localData))
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

    // console.log(allSeconds)
    game.currentTimer = [
      h,
      m,
      s
    ]
  }, 1000)
}

const formatTime = (timer) => {
  const gameTimer = timer.map(time => String(time).padStart(2, 0))
  return gameTimer
}

const restart = document.querySelector('#restartGame')
restart.addEventListener('click', restartGame)

startGame()