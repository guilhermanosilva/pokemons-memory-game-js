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

    gameBoard.appendChild(cardElement);
  });
};

const createCardContent = (face, card, cardElement) => {
  let cardElementFace = document.createElement('div');
  cardElementFace.classList.add(face);

  if (face == FRONT) {
    cardElementFace.innerHTML += `<img src="images/${card.name}.jpg" class="${FRONT}"/>`;
  } else {
    cardElementFace.innerHTML += `<img src="./images/pokeball.png" width="100px" class="${BACK}"/>`;
  }

  cardElement.appendChild(cardElementFace);
};
startGame();
