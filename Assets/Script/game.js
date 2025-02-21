const backgroundCanvas = document.querySelector('#background-board');
const backgroundContext = backgroundCanvas.getContext('2d');
const playerCanvas = document.querySelector('#player-board');
const playerContext = playerCanvas.getContext('2d');
const darkCanvas = document.querySelector('#dark-board');
const darkContext = darkCanvas.getContext('2d');
const instructionsContainer = document.querySelector('#instructions');
const letterContainer = document.querySelector('#letter');

class Game {
    constructor() { }

    start() {
        loadImages().then(images => {
            this.player = new Player(playerCanvas, playerContext, images);

            this.board = new Board(backgroundCanvas, backgroundContext, this.player, images, this.win.bind(this));
            this.board.render();

            this.darkBoard = new DarkBoard(darkCanvas, darkContext, this.player);
            this.darkBoard.render();

            this.hasWon = false;

            this.frame = 0;
            this.doFrame();

            this.bindKeys();

            this.win();
        });
    }

    doFrame() {
        this.board.player.render(this.frame);
        this.board.doMotionFrame();

        this.frame++;

        window.requestAnimationFrame(this.doFrame.bind(this));
    }

    movePlayer(direction) {
        if (this.hasWon) {
            return;
        }

        if (this.board.remainingMotion[0] || this.board.remainingMotion[1]) {
            return;
        }

        let row, column;

        switch (direction) {
            case 'up':
                row = this.player.row - 1;
                column = this.player.column;
                break;
            case 'down':
                row = this.player.row + 1;
                column = this.player.column;
                break;
            case 'left':
                row = this.player.row;
                column = this.player.column - 1;
                break;
            case 'right':
                row = this.player.row;
                column = this.player.column + 1;
                break;
        }

        if (this.board.canOccupy(row, column)) {
            this.player.row = row;
            this.player.column = column;

            this.board.updateLamp(row, column, this.darkBoard);

            this.board.move(direction, (() => {
                this.board.render();
                this.darkBoard.render();
            }).bind(this));
        }
    }

    bindKeys() {
        const directions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            'a': 'left',
            's': 'down',
            'd': 'right',
        };

        document.body.addEventListener('keyup', e => {
            if (e.key in directions) {
                this.movePlayer(directions[e.key]);
            }
        }, false);
    }

    win() {
        const centerRow = Math.floor(this.board.board.length / 2);
        const centerCol = Math.floor(this.board.board[0].length / 2);

        this.player.row = centerRow;
        this.player.column = centerCol;

        this.board.fullRender();
        this.darkBoard.hide();
        this.player.hide();

        instructionsContainer.classList.add('hide');
        letterContainer.classList.remove('hide');

        this.hasWon = true;
    }
}

const game = new Game();
game.start();