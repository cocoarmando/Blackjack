
/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();

/*----- app's state (variables) -----*/
let shuffledDeck = [];
let playerHand = [];
let dealerHand = [];
let playerHandValue;
let dealerHandValue;
let winner = null;
let initialFaceDown; 

/*----- cached element references -----*/
let playerHandHtml = document.getElementById('playerHand');
let dealerHandHtml = document.getElementById('dealerHand');
let hitButton = document.getElementById('hit');
let stayButton = document.getElementById('stay');
let nextHandButton = document.getElementById('nextHand');
let gameResult = document.getElementById('gameResult');


/*----- event listeners -----*/
hitButton.addEventListener('click', playerHit);
stayButton.addEventListener('click', dealerChoice);
nextHandButton.addEventListener('click', init);


/*----- functions -----*/


function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for game of blackjack, not war
          value: Number(rank) || (rank === 'A' ? 11 : 10)
        });
      });
    });
    return deck;
}



function shuffleDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    const tempDeck = [...masterDeck];
    shuffledDeck = [];
    while (tempDeck.length) {
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
      shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    
}


init();

//compareHands();
// make function that takes first two cards of deck and assigns to player hand. 
function dealToPlayer() {
  playerHand.push(shuffledDeck.pop())
  playerHand.push(shuffledDeck.pop())
}
// make function that takes first two cards of deck and assigns to dealer hand. 
function dealToDealer() {
  dealerHand.push(shuffledDeck.pop())
  dealerHand.push(shuffledDeck.pop())
}
// make function that takes player hand values and displays them in html
function displayPlayerHand() {
  playerHandHtml.innerHTML = '';
  playerHand.forEach(function(card, idx) {
    let c = `<div class = "card ${card.face}"></div>`
    playerHandHtml.innerHTML += c;

  })
}
// create multiple divs with class names that relates to value card.

// make function that takes dealer hand values and displays them in html
function displayDealerHand() {
  dealerHandHtml.innerHTML = '';
  dealerHand.forEach(function(card, idx) {
    let c = `<div class = "card ${card.face}"></div>`
    if(idx === 1 && initialFaceDown) {
       c = `<div class = "card back-red"></div>`
       initialFaceDown = false;
    } 
    dealerHandHtml.innerHTML += c;
    
  })
}

function compareHands() {
  let dealerTotal = 0;
  let numAcesDealer = 0;
  let numAcesPlayer = 0;
  for(let i = 0; i < dealerHand.length; i++) {
    dealerTotal += dealerHand[i].value;
    if(dealerHand[i].value === 11){
      numAcesDealer += 1;
    }
  }
  while(dealerTotal > 21 && numAcesDealer) {
    dealerTotal -= 10;
    numAcesDealer--; 
  }

  let playerTotal = 0;
  for(let i = 0; i < playerHand.length; i++) {
    playerTotal += playerHand[i].value;
    if(playerHand[i].value === 11) {
      numAcesPlayer += 1;
    }
  }
  while(playerTotal > 21 && numAcesPlayer) {
    playerTotal -= 10;
    numAcesPlayer--;
  }
  

  if(dealerTotal >= playerTotal && dealerTotal <= 21) {
    winner = 'dealer';
    gameResult.innerText = `Dealer won with ${dealerTotal}`;
  } else {
    winner = 'player';
    gameResult.innerText = `Player won with ${playerTotal}`;
  }
}


function playerCheck() {
  let playerTotal = 0;
  let numAces = 0;
  for(let i = 0; i < playerHand.length; i++) {
    playerTotal += playerHand[i].value;
    if(playerHand[i].value === 11) {
      numAces += 1;
    }
  }
  while(playerTotal > 21 && numAces) {
    playerTotal -= 10;
    numAces--; 
  }

  console.log(playerTotal);
  if(playerTotal === 21 && playerHand.length === 2) {
    gameResult.innerText = `Blackjack! Player won with ${playerTotal}`;
    winner = 'player';
  } 
  else if(playerTotal > 21) {
    gameResult.innerText = `Thats a bust. You lose.`;
    winner = 'dealer';
  }
}

function playerHit() {
  if(winner === null) {
    let addedCard = shuffledDeck.pop();
    playerHand.push(addedCard);
    playerCheck();
    initialFaceDown = true;
    render();
  } else {
    return;
  }
  
}

function dealerChoice() {
  let numAces = 0;
  if(winner === null) {
    let dealerTotal = 0;
  
    for(let i = 0; i < dealerHand.length; i++) {
      dealerTotal += dealerHand[i].value;
      if(dealerHand[i].value === 11) {
        numAces += 1;
      }
    }
    while(dealerTotal > 21 && numAces) {
      dealerTotal -= 10;
      numAces--; 
    }
    while(dealerTotal < 17) {
      let addedCard = shuffledDeck.pop();
      dealerHand.push(addedCard);
      dealerTotal += addedCard.value;
    }
    if(dealerTotal > 21) {
      winner = 'player';
      console.log('dealer bust!');
      gameResult.innerText = `Dealer bust! You win.`;
    }
    compareHands();
    render();
    
    } else {
        return;
  }
  
}

function render() {
  displayDealerHand();
  displayPlayerHand();

}

function init() {
  playerHand = [];
  dealerHand = [];
  winner = null;
  initialFaceDown = true;
  gameResult.innerText = '';
  shuffleDeck();
  dealToPlayer();
  dealToDealer();
  playerCheck();
  render();
}