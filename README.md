# Memory Game Project

![screenshot](https://raw.githubusercontent.com/bigfatpartyguy/P3_memory-game/master/memory-game_ss.png)

## About

This repository is a game hosted by [GitHub Pages](http://pages.github.com). This game was developed as a project for Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program.

## Instructions

Memory game is an implementation of a card game called "Concentration" in wicth all of the cards are laid down on a surface and two cards are flipped face up over each turn. The object of the game is to turn over pairs of matching cards.

* To play the game visit this [page](https://bigfatpartyguy.github.io/P3_memory-game/)
* Before begin all cards will be shuffled and shown face up for 3 seconds to give an opportunity to remember them. Then all cards will be flipped over face down.
* To flip over a card simply click or tap on it.
  * Each turn only two cards can be flipped over.
  * The cards are considered matched if they have the same symbol on it.
  * If the cards do not match, they are both turned back face down.
  * If the cards match, they are left face up.
* The game will be considered complete when all cards match. Then the modal window pop up with a suggestion to start new game.
* To restart the game before it is completed click or tap the red restart button that is to the right of the timer. The modal window pop up with a suggestion to start new game.

The game has a second timer, counter of moves and the star rating. Star rating is represented as five stars :star::star::star::star::star:, which is considered as the best score. Depending of the number of moves player will lose stars one at a time :star::star::star::star:. The lowest score when there are no stars.

## Built with

The Memory Game is purely built in **JavaScript**, **HTML** and **CSS**.

This project has also been built with the following libraries:

* [sweetalert](https://github.com/t4t5/sweetalert): for modal windows.
* [animate.css](https://github.com/daneden/animate.css): for animations.

As well as with some icons from the [Font Awesome](https://fontawesome.com/).
