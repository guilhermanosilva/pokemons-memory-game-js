const CARD = 'card';
const FRONT = 'card-front';
const BACK = 'card-back';

const startGame = () => {
  initializeCards(game.createCards());
};

const initializeCards = (cards) => {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';

  cards.forEach((card) => {
    let cardElement = document.createElement('div');
    cardElement.id = card.id;
    cardElement.classList.add(CARD);
    cardElement.dataset.pokemon = card.name;

    createCardContent(FRONT, card, cardElement);
    createCardContent(BACK, card, cardElement);

    cardElement.addEventListener('click', flipped);
    gameBoard.appendChild(cardElement);
  });
};

const createCardContent = (face, card, cardElement) => {
  let cardElementFace = document.createElement('div');
  cardElementFace.classList.add(face);

  if (face == FRONT) {
    let cardFaceFront = document.createElement('img');
    cardFaceFront.src = './images/' + card.name + '.jpg';
    cardElementFace.appendChild(cardFaceFront);
  } else {
    let cardFaceBack = document.createElement('img');
    cardFaceBack.src = './images/pokeball.png';
    cardElementFace.appendChild(cardFaceBack);
  }

  cardElement.appendChild(cardElementFace);
};

const flipped = (event) => {
  let current = event.currentTarget;
  current.classList.add('flip');
};

startGame();
