const backgroundCanvas = document.querySelector('#background-board');
const backgroundContext = backgroundCanvas.getContext('2d');
const playerCanvas = document.querySelector('#player-board');
const playerContext = playerCanvas.getContext('2d');
const darkCanvas = document.querySelector('#dark-board');
const darkContext = darkCanvas.getContext('2d');

class Game {
    constructor() { }

    start() {
        loadImages().then(images => {
            this.player = new Player(playerCanvas, playerContext, images);

            this.board = new Board(backgroundCanvas, backgroundContext, this.player, images);
            this.board.render();

            this.darkBoard = new DarkBoard(darkCanvas, darkContext);
            this.darkBoard.addPoint(
                darkCanvas.width / 2,
                darkCanvas.height / 2,
                48
            );
            this.darkBoard.render();

            this.frame = 0;
            this.doFrame();

            this.bindKeys();
        });
    }

    doFrame() {
        this.board.player.render(this.frame);
        this.board.doMotionFrame();

        this.frame++;

        window.requestAnimationFrame(this.doFrame.bind(this));
    }

    movePlayer(direction) {
        if (this.board.remainingMotion[0] || this.board.remainingMotion[1]) {
            return;
        }

        switch (direction) {
            case 'up':
                if (this.board.canOccupy(this.player.row - 1, this.player.column)) {
                    this.player.row--;
                    this.board.move(direction);
                }
                break;
            case 'down':
                if (this.board.canOccupy(this.player.row + 1, this.player.column)) {
                    this.player.row++;
                    this.board.move(direction);
                }
                break;
            case 'left':
                if (this.board.canOccupy(this.player.row, this.player.column - 1)) {
                    this.player.column--;
                    this.board.move(direction);
                }
                break;
            case 'right':
                if (this.board.canOccupy(this.player.row, this.player.column + 1)) {
                    this.player.column++;
                    this.board.move(direction);
                }
                break;
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
}

const game = new Game();
game.start();