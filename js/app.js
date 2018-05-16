
let cards = document.querySelectorAll('.card'),
deck = document.querySelector('.deck'),
cardStack = [],
moves = document.querySelector('.moves'),
correctMoves = 0,
timer = document.querySelector('.timer'),
timerId,
busyFlag = false;

// See https://github.com/daneden/animate.css/issues/644
let animationEnd = (function (el) {
    let animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
    };

    for (let t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
})(document.createElement('div'));

const restartBtn = document.querySelector('.restart'),
score = document.querySelector('.stars'),
animClass = ['animated', 'flipInY', 'zoomIn', 'tada', 'shake', 'zoomIn'];

/*
    Create a function to update user's score according to number of moves
    Add methods to that function to reset the score
    and to change score color according to number moves
*/

const changeScore = (() => {
    function changeScore() {
        let stars = document.querySelectorAll('.fa-star');
        for (let i = stars.length - 1; i >= 0; i--) {
            if (stars[i].getAttribute('data-prefix') === 'fas') {
                stars[i].classList.toggle('fas');
                stars[i].classList.toggle('far');
                break;
            }
        }
    }

    changeScore.reset = () => {
        let stars = document.querySelectorAll('.fa-star');
        for(let i = 0; i <stars.length; i++) {
            if (stars[i].getAttribute('data-prefix') === 'far') {
                stars[i].classList.toggle('far');
                stars[i].classList.toggle('fas');
            }
        }
        score.classList.remove('bad-score');
    };

    changeScore.changeColor = () => {
        score.classList.add('bad-score');
    };

    return changeScore;
})();

// Remove animation classes from card
function removeAnim(evt) {
    let target;
    if (evt.target) {
        target = evt.target;
    } else {
        target = evt;
    }
    target.classList.remove(...animClass);
    target.removeEventListener(animationEnd, removeAnim);
}

// Start new game, shuffle cards, reset timer, etc.
function freshStart() {
    moves.textContent = 0;
    cardStack = [];
    correctMoves = 0;
    if (timerId) {
        clearTimeout(timerId);
        timer.textContent = 0;
    }
    let cardsArr = [...cards]
    let fragment = document.createDocumentFragment();
    changeScore.reset();
    shuffle(cardsArr);
    deck.innerHTML = '';
    cardsArr.forEach(function(card) {
        card.className = 'card';
        fragment.appendChild(card);
    });
    deck.appendChild(fragment);
    cards = document.querySelectorAll('.card');

// Add recursive animtaion to cards and open them for preview
    (function bounce(i) {
        setTimeout(() => {
            cards[i].classList.add('animated', 'zoomIn', 'open');
            cards[i].addEventListener(animationEnd, removeAnim);
            if (++i < cards.length) {
                bounce(i);
            }
        }, 20);
    })(0);

// Preview cards for 3s and then close them
    setTimeout(() => {
        (function endPreview(i) {
            setTimeout(() => {
                cards[i].classList.add('animated', 'flipInY');
                cards[i].classList.remove('open');
                cards[i].addEventListener(animationEnd, removeAnim);
                if (++i < cards.length) {
                    endPreview(i);
                }
            }, 20);
        })(0);
    }, 3000);

    setTimeout(() => {
        deck.addEventListener('click', openCard);
    }, 3700);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
    Main function to invoke when a card was clicked
    Open card
    Initiate the countdown of the second timer
    Add functions to stack of 2 to compare them
*/

function openCard(event) {
    if (!busyFlag && cardStack.length < 2) {
        busyFlag = true;
        let target = event.target;
        if (target.classList.contains('card')) {
            if (+timer.textContent === 0) {
                (function startTimer() {
                    timer.textContent++;
                    timerId = setTimeout(startTimer, 1000);
                })();
            }
            if (!cardStack.length) {
                target.classList.add('open', 'animated', 'flipInY');
                addToStack(target);
                // target.addEventListener('animationend', removeAnim);
                busyFlag = false;
                setTimeout(() => {
                    // target.classList.remove(...animClass);
                    removeAnim(target);
                }, 300);
                return;
            }
            addToStack(target);
        }
        busyFlag = false;
    }
}

/*
    Add two opened cards to an array, compare them and run
    appropriate function whether they've matched or not
*/

function addToStack(node) {
    cardStack.push(node);
    if (cardStack.length === 2) {
        let a = cardStack[0].innerHTML;
        let b = cardStack[1].innerHTML;
        if (a === b) {
            lockMatched();
        } else {
            closeUnmatched();
        }
    }
    if (correctMoves === cards.length / 2) {
        setTimeout(() => {
            victoryModal();
        }, 300);
    }
}

// Lock the cards in the open position

function lockMatched() {
    incrementMoves();
    correctMoves++;
    cardStack.forEach(function(card) {
        card.classList.add('animated', 'match', 'tada');
    });
    setTimeout(() => {
        cardStack = [];
    }, 400);
}

// Close unmatched cards

function closeUnmatched() {
    incrementMoves();
    cardStack.forEach(function(card) {
        card.classList.add('animated', 'shake', 'open', 'wrong');
        setTimeout(() => {
            card.className = 'card animated flipInY';
            card.addEventListener(animationEnd, removeAnim);
        }, 700);
    });
    setTimeout(() => {
        cardStack = [];
    }, 800);
}

function incrementMoves() {
    const ratingArr = [16, 20, 23, 25, 27];
    moves.textContent++;
    if (ratingArr.includes(+moves.textContent)) {
        changeScore();
    }
    if (+moves.textContent >= ratingArr[2]) {
        changeScore.changeColor();
    }
}

// MODAL

function restartModal() {
    swal({
        icon: 'warning',
        title: 'Are you sure you want to restart?',
        text: 'Your progress will be lost',
        buttons: {
            confirm: {
                text: 'Yes',
                value: true,
                className: 'confirm'
            },
            cancel: {
                text: 'No',
                visible: true,
                className: 'cancel'
            }
        },
    }).then((value) => {
        if (value) { freshStart(); }
    });
}

function victoryModal() {
    const timerNum = timer.textContent,
        movesNum = moves.textContent,
        swalScore = score.cloneNode(true);
    swal({
        icon: 'success',
        title: 'Congratulations!',
        text: `You\'ve completed the game within ${timerNum} second(s) and ${movesNum} move(s)!`,
        content: swalScore,
        button: 'Play again!',
    }).then(freshStart);
}

// MAIN EVENT LISTENERS

document.addEventListener('DOMContentLoaded', freshStart);
restartBtn.addEventListener('click', restartModal);