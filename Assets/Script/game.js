const canvas = document.querySelector('#gameboard');
const context = canvas.getContext('2d');

class Game {
    constructor(canvas, context) {
        this.board = new Board(canvas, context);

        this.board.render();
    }

    doFrame() {}
}

const game = new Game(canvas, context);