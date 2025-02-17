const backgroundCanvas = document.querySelector('#background-board');
const backgroundContext = backgroundCanvas.getContext('2d');
const playerCanvas = document.querySelector('#player-board');
const playerContext = playerCanvas.getContext('2d');

class Game {
    constructor(backgroundCanvas, backgroundContext, playerCanvas, playerContext) {
        loadImages().then(images => {
            this.player = new Player(playerCanvas, playerContext, images);

            this.board = new Board(backgroundCanvas, backgroundContext, this.player, images);

            this.board.render();

            this.frame = 0;
            this.doFrame();
        });
    }

    doFrame() {
        this.board.player.render(this.frame);

        this.frame++;

        window.requestAnimationFrame(this.doFrame.bind(this));
    }
}

const game = new Game(backgroundCanvas, backgroundContext, playerCanvas, playerContext);