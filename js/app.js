const GAME = function() {

  /**
   * Stack class to keep track of matches.
   */
  class Stack {
    constructor() {
      this.holder = [];
    }

    push(val) {
      this.holder.push(val);
    }

    pop() {
      return this.holder.pop();
    }

    peekColor() {
      if (this.holder.length > 1) {
        return this.holder[this.holder.length - 2].classList[1];
      }
      return "Not Enough Elements";
    }

    hasMoreThanOne() {
      return this.holder.length > 1;
    }

    removeAll() {
      this.holder = [];
    }

  }

  const STARTING_MOVES = 0,
    TOTAL_NUMBER_OF_CARDS = 16,
    USER_MOVES_TO_DECREASE_COUNTER = 10;

  let stack = new Stack(),
    winners = [],
    boxSection = document.querySelector('.cards'),
    updatedUserMoves,
    input = document.querySelector('.button-section input'),
    cardContents = ["one", "two", "three", "four", "five", "six", "seven",
      "eight", "one", "two", "three", "four", "five", "six", "seven", "eight"],
    cards = document.querySelectorAll('.tile'),
    shuffleArr,
    allStars = document.querySelectorAll('.rating span'),
    allStarsModal = document.querySelectorAll('.duplicate span'),
    resetButton = document.querySelector('.round-button'),
    noPlayBtn = document.querySelector(".no-play"),
    yesPlatBtn = document.querySelector(".yes-play"),
    modal = document.getElementById('myModal'),
    timerHolder = document.querySelector(".timer"),
    seconds = 0, minutes = 0, hours = 0, t;

  /**
   * Entry point for the game. Calls to shuffle the cards' classes and starts our timer
   */
  function startGame() {
    shuffleTheClasses();
    startStopWatch();
  }

  /**
   * Shuffles the cards.
   * We create a new array to avoid a reference assignment.
   */
  function shuffleTheClasses() {
    //shuffle the classes
    let newArr = [].concat(cardContents);
    shuffleArr = shuffle(newArr);

    //add the shuffle classes
    cards.forEach(function (card) {
      addShuffleClass(card);
    });
  }


  /**
   * Shuffles array in place.
   */
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /**
   * Adds the shuffled array of classes to our card element.
   * @param card
   */
  function addShuffleClass(card) {
    card.classList.add(shuffleArr.pop());
  }

  /**
   * Checks if a particular element has a class.
   * @param e a valid dom element
   * @returns {boolean}
   */
  function hasHiddenClass(e) {
    return e.target.classList.contains("tile-hidden");
  }

  /**
   * Adds a class to a dom target.
   * @param target
   */
  function addHiddenClass(target) {
    target.classList.add("tile-hidden");
  }

  /**
   * Calls to remove the checked star if a move counter is divisible by our predefined counter
   */
  function updateStarsIfNeeded() {
    if (updatedUserMoves % USER_MOVES_TO_DECREASE_COUNTER === 0) {
      removeCheckStarClass(allStars);
      removeCheckStarClass(allStarsModal);
    }
  }

  /**
   * Loop over the stars and remove one of the checked stars, break out immediately.
   * @param stars
   */
  function removeCheckStarClass(stars) {
    try {
      stars.forEach(star => {
        if (star.classList.contains("checked-star")) {
          star.classList.remove("checked-star");
          throw "BreakException";
        }
      })
    } catch (e) {
      if (e !== "BreakException") throw e;
    }
  }

  /**
   * Process the star rating of the user based on moves.
   */
  function processRating() {
    //update the current by 1
    let intermediateVal = parseInt(input.value);
    updatedUserMoves = intermediateVal + 1;
    //display the updated value
    updateUserMoveInput(input, updatedUserMoves);

    //decrease the stars if needed
    updateStarsIfNeeded();
  }

  /**
   * Helper function to set the value of the element.
   * @param element
   * @param newVal
   */
  function updateUserMoveInput(element, newVal) {
    element.value = newVal;
  }

  /**
   * Helper function to hide the modal.
   */
  function closeModal() {
    modal.style.display = "none";
  }

  /**
   * Checks if the user has won based on the uncovered cards.
   */
  function hasUserWon() {
    if (winners.length === TOTAL_NUMBER_OF_CARDS) {
      //stop timers
      stopTimer();
      let spanClose = document.querySelector(".close"),
        noPlayBtn = modal.querySelector(".no-play"),
        timerContent = document.querySelector(".timer"),
        timerShow = modal.querySelector(".timer-show");

      timerShow.textContent = timerContent.textContent;

      //show the modal
      modal.style.display = "block";

      //close the modal events
      spanClose.onclick = function () {
        closeModal();
      };
      noPlayBtn.onclick = function () {
        closeModal();
      };
      window.onclick = function (event) {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      };
    }
  }

  /**
   * Removes a specific class from the target element
   * @param e
   */
  function removeHiddenClass(e) {
    e.target.classList.remove("tile-hidden");
  }

  /**
   * Adds the check star class if not present
   * @param stars
   */
  function addCheckStarClass(stars) {
    stars.forEach(star => {
      if (!star.classList.contains("checked-star")) {
        star.classList.add("checked-star");
      }
    });
  }

  /**
   * Cleans the game.
   * Resets the game.
   */
  function cleanTheGame() {
    stack.removeAll();
    winners = [];

    cards.forEach(card => {
      //remove the classes
      card.className = "";

      //add the classes
      card.classList.add("tile");
      card.classList.add("tile-hidden");
    });

    //shuffle the cards
    shuffleTheClasses();

    //ensure user counter is reset
    updateUserMoveInput(input, STARTING_MOVES);

    //add the star class to both rating systems.
    addCheckStarClass(allStars);
    addCheckStarClass(allStarsModal);

    //timer
    stopTimer();
    clearTimer();
    reStartTimer();
  }


  /**
   * Prepares the timer.
   */
  function startStopWatch() {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
    }

    timerHolder.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00")
      + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00")
      + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
  }

  /**
   * Starts the timer.
   */
  function timer() {
    //native function http://mdn.beonex.com/en/DOM/window.setTimeout.html
    t = setTimeout(startStopWatch, 1000);
  }

  /**
   * Restarts the timer.
   */
  function reStartTimer() {
    timer();
  }

  /**
   * Stops the timer by clearing the instance of timer.
   */
  function stopTimer() {
    //native function http://mdn.beonex.com/en/DOM/window.clearTimeout.html
    clearTimeout(t);
  }

  /**
   * Resets the timer.
   */
  function clearTimer() {
    timerHolder.textContent = "00:00:00";
    seconds = 0;
    minutes = 0;
    hours = 0;
  }

  /**
   * Event listeners section.
   */
  boxSection.addEventListener("click", function (e) {
    if (hasHiddenClass(e)) {
      //remove the hidden class
      removeHiddenClass(e);

      let target = e.target,
        color = target.classList[1];
      //add the target to the stack
      stack.push(target);

      //process the user"s rating
      processRating();

      //if stack has more than 1 compare
      if (stack.hasMoreThanOne()) {
        if (stack.peekColor() === color) {
          //user uncovered match
          winners.push(stack.pop());
          winners.push(stack.pop());

          //check if the user won
          hasUserWon();
        } else {
          //user failed to find match add hidden class to both
          let current = stack.pop();
          let previous = stack.pop();
          addHiddenClass(current);
          addHiddenClass(previous);
        }
      }
    }
  });

  /**
   * Adds an event listener for when the user wants to reset.
   */
  resetButton.addEventListener("click", function (event) {
    cleanTheGame();
  });

  /**
   * Adds an event listener for when the user wants to play again.
   */
  yesPlatBtn.addEventListener("click", e => {
    closeModal();
    cleanTheGame();
  });

  /**
   * Adds an event listener for when the user does not wish to play again.
   */
  noPlayBtn.addEventListener("click", function (event) {
    closeModal(modal);
  });

  //ensure no globals exists and only expose the start game function
  return {
    startGame: function(){
      return startGame()
    }
  }
}();

// start the game
GAME.startGame();
