const backgroundCanvas = document.querySelector('#background-board');
const backgroundContext = backgroundCanvas.getContext('2d');
const playerCanvas = document.querySelector('#player-board');
const playerContext = playerCanvas.getContext('2d');
const darkCanvas = document.querySelector('#dark-board');
const darkContext = darkCanvas.getContext('2d');
const instructionsContainer = document.querySelector('#instructions');
const letterContainer = document.querySelector('#letter');
const restartButton = document.querySelector('#restart');
const sizeMessage = document.querySelector('#size-message');
const sizeContainer = document.querySelector('#window-size');
const contentContainer = document.querySelector('#content');


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

            if (window.localStorage.getItem('has-won')) {
                this.win();
            }
        });
    }

    doFrame() {
        this.board.player.render(this.frame);
        this.board.doMotionFrame();

        this.frame++;

        window.setTimeout(this.doFrame.bind(this), 15);
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

            if (!this.hasWon) {
                this.board.move(direction, (() => {
                    this.board.render();
                    this.darkBoard.render();
                }).bind(this));
            }
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

        contentContainer.classList.add('scrollable');

        instructionsContainer.classList.add('hide');
        letterContainer.classList.remove('hide');
        restartButton.classList.remove('hide');

        this.hasWon = true;

        window.localStorage.setItem('has-won', true);
    }
}

const game = new Game();
game.start();

restartButton.addEventListener('click', () => {
    window.localStorage.removeItem('has-won');
    window.location.reload();
}, false);

const minWidth = 550;
const minHeight = 550;

function checkWindowSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth < minWidth || windowHeight < minHeight) {
        contentContainer.classList.add('hide');
        sizeMessage.classList.remove('hide');

        sizeContainer.innerText = `${windowWidth} x ${windowHeight}`;
    } else {
        contentContainer.classList.remove('hide');
        sizeMessage.classList.add('hide');
    }
}

window.addEventListener('resize', checkWindowSize, false);
checkWindowSize();