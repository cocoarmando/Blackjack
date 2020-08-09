console.log('connected');
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

/*----- cached element references -----*/
let playerHandHtml = document.getElementById('playerHand');
let dealerHandHtml = document.getElementById('dealerHand');
console.log(playerHandHtml, dealerHandHtml);
let hitButton = document.getElementById('hit');

/*----- event listeners -----*/
hitButton.addEventListener('click', playerHit);

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
// play events

shuffleDeck();
dealToPlayer();
dealToDealer();
displayPlayerHand();
displayDealerHand();
compareHands();
// make function that takes first two cards of deck and assigns to player hand. 
function dealToPlayer() {
    playerHand.push(shuffledDeck.pop())
    playerHand.push(shuffledDeck.pop())
    console.log(playerHand);
}
// make function that takes first two cards of deck and assigns to dealer hand. 
function dealToDealer() {
    dealerHand.push(shuffledDeck.pop())
    dealerHand.push(shuffledDeck.pop())
    console.log(dealerHand);
}
// make function that takes player hand values and displays them in html
function displayPlayerHand() {
    playerHand.forEach(function(card, idx) {
        let c = `<div class = "card ${card.face}"></div>`
        playerHandHtml.innerHTML += c;

    })
}
// create multiple divs with class names that relates to value card.

// make function that takes dealer hand values and displays them in html
function displayDealerHand() {
    dealerHand.forEach(function(card, idx) {
        let c = `<div class = "card ${card.face}"></div>`
        dealerHandHtml.innerHTML += c;

    })
}

function compareHands() {
  let dealerTotal = 0;
  for(let i = 0; i < dealerHand.length; i++) {
    dealerTotal += dealerHand[i].value;
  }
  console.log(dealerTotal);

  let playerTotal = 0;
  for(let i = 0; i < playerHand.length; i++) {
    playerTotal += playerHand[i].value;
  }
  console.log(playerTotal);


  /*
  dealerHandValue = dealerHand.forEach(function(card) {
    let total;
    total = card.value + total;
    console.log(card.value);
  })
  console.log(total);
  */
}

function playerHit() {
  console.log('hit');
  let addedCard = shuffledDeck.pop();
  playerHand.push(addedCard);
  let c = `<div class = "card ${addedCard.face}"></div>`
  playerHandHtml.innerHTML += c;
  console.log(addedCard);
  console.log(playerHand);
  compareHands();
}