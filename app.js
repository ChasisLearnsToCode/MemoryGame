let startTime;
let elapsedTime = 0;
let timerInterval;

//Start game function
function timer() {
  createDivsForColors(shuffledColors);
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").textContent = "Time Elapsed: " + elapsedTime;
  }, 1000);
  const startButton = document.getElementById("startGameButton");
  startButton.remove();
}

//Stop Game function
function stopTimer() {
  clearInterval(timerInterval);
  document.getElementById('timer').textContent = "Time Elapsed: " + elapsedTime;
}

//Restart Game function
function restartGame() {
  clearInterval(timerInterval);
  gameContainer.replaceChildren();
  let newShuffle = shuffle(COLORS);
  const newGame = createDivsForColors(newShuffle);
  gameContainer.append(newGame);
  currentScore = 0;
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").textContent = "Time Elapsed: " + elapsedTime;
  }, 1000);
}

const gameContainer = document.getElementById("game");
const background = document.querySelector('body');
const score = document.getElementById('score');
background.style.backgroundColor = "black";

let card1 = null;
let card2 = null;
let cardsFlipped = 0;
let noClicking = false;
let currentScore = 0;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "tan",
  "tan",
  "yellow",
  "yellow",
  "cyan",
  "cyan",
  "pink",
  "pink"
];


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card

function createDivsForColors(colorArray) {
  const colorCount = {};// variable to keep track of how many divs associated to the specific color we have
  for (let color of colorArray) {
     // Initialize color count if not already done
     if (!colorCount[color]) {
      colorCount[color] = 0;
    }

    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // Increment the count for the current color and generate a unique ID
    colorCount[color] += 1;
    let uniqueId = color + colorCount[color]; // e.g., "red1", "blue1", "red2"
    newDiv.id = uniqueId;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!

function handleCardClick(event) {

  let currentCard = event.target;

  if (noClicking) return;
  if (currentCard.classList.contains("flipped")) return;


  // Update the clicked card's background color
  currentCard.style.backgroundColor = currentCard.classList[0];

  // Step 2:
  if (!card1 || !card2) { //checks to see if either card1 or card2 has not been assigned
    currentCard.classList.toggle("flipped"); //if either one has not been assigned, we assign the unassigned card to the class List "flipped"
    card1 = card1 || currentCard;//if card1 is unassigned, it assigns it the value of the current or "flipped" card
    card2 = currentCard === card1 ? null : currentCard; //checks if current card is the same as card1.  If it is the same then it assigns card2 to "null", if it is not the same, it assigns card2 the value of current Card
  }

  if (card1 && card2) { //checks to see that both, card1 and card2 are set
    noClicking = true; //disables further clicks on other cards in order to process the current flipped cards

    let image1 = card1.className;//saves the cards' class names into variables
    let image2 = card2.className;


    if (image1 === image2){//checks to see if the two cards match in terms of class names
      cardsFlipped += 2; //if they do match in class names, the counter goes up by 2, tracking the number of flipped cards that are a pair
      currentScore += 1;


      card1.removeEventListener("click", handleCardClick);//prevents cards to be clicked again once they are matched
      card2.removeEventListener("click", handleCardClick);
      
      card1 = null;//resets the values of the current cards
      card2 = null;
      noClicking = false;//enables clicks again

      score.innerHTML = "Score: " + currentScore;

    } else { //if the cards don't match, apply a function that makes the cards blank or "unflipped"
      setTimeout(function() {
        card1.style.backgroundColor = "";
        card2.style.backgroundColor = "";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1 = null;//resets the values of the current cards
        card2 = null;
        noClicking = false;//enables clicking again
        currentScore += 1;
        score.innerHTML = "Score: " + currentScore;
      }, 1000);// sets the timer to 1 second
    }

  }
  if (cardsFlipped === COLORS.length){//If the number of cards flipped equals the total number of cards in the array, then let the player know the game is over
    clearInterval(timerInterval);
    alert('Game Over!');
  }
}




