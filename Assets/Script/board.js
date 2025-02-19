const MAP = [
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2],
    [2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2],
    [2, 2, 0, 0, 2, 0, 2, 2, 0, 2, 2, 2, 3, 2, 0],
    [2, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0],
    [2, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const lanternsCounter = document.querySelector('#remaining-lanterns');

class Board {
    static WIDTH = 7;
    static HEIGHT = 5;
    static MOTIONSPEED = 4;

    constructor(canvas, context, player, images, winCallback) {
        this.canvas = canvas;
        this.context = context;

        this.canvas.width = Board.WIDTH * Tile.TILESIZE;
        this.canvas.height = Board.HEIGHT * Tile.TILESIZE;

        this.player = player;
        this.images = images;

        this.winCallback = winCallback;

        this.wallImage = images['wall'];

        this.remainingLanterns = 0;
        this.board = this.generateBoard(MAP);

        this.remainingMotion = [0, 0];
        this.motionCallback = undefined;
    }

    generateBoard(map) {
        let board = [];

        for (let i = 0; i < map.length; i++) {
            const row = map[i];

            let boardRow = [];

            for (let j = 0; j < row.length; j++) {
                const column = row[j];

                let object = undefined;

                if (column === 1) {
                    this.player.row = i;
                    this.player.column = j;
                } else if (column === 2) {
                    object = new GameObject('stone', i, j, this.canvas, this.context, this.images);
                } else if (column === 3) {
                    object = new GameObject('off-lamp', i, j, this.canvas, this.context, this.images);

                    this.remainingLanterns++;
                }

                const tile = new Tile(this.canvas, this.context, object, this.images);

                boardRow.push(tile);
            }

            board.push(boardRow);
        }

        lanternsCounter.innerText = this.remainingLanterns;

        return board;
    }

    render() {
        const rowOffset = Math.floor(this.player.row - Board.HEIGHT / 2) + 1;
        const colOffset = Math.floor(this.player.column - Board.WIDTH / 2) + 1;

        const rowLength = Math.min(rowOffset + Board.HEIGHT, this.board.length) - rowOffset;
        const colLength = Math.min(colOffset + Board.WIDTH, this.board[0].length) - colOffset;

        for (let i = 0; i <= rowLength; i++) {
            for (let j = 0; j <= colLength; j++) {
                const x = j * Tile.TILESIZE;
                const y = i * Tile.TILESIZE;

                if (i + rowOffset < 0 || j + colOffset < 0 ||
                    i + rowOffset === this.board.length || j + colOffset === this.board[0].length) {
                    this.context.drawImage(this.wallImage, x, y);
                    continue;
                }

                const tile = this.board[i + rowOffset][j + colOffset];

                tile.render(x, y);

                if (tile.object) {
                    tile.object.render(x, y);
                }
            }
        }
    }

    move(direction, callback) {
        switch (direction) {
            case 'up':
                this.remainingMotion = [0, Tile.TILESIZE];
                break;
            case 'down':
                this.remainingMotion = [0, -Tile.TILESIZE];
                break;
            case 'left':
                this.remainingMotion = [Tile.TILESIZE, 0];
                break;
            case 'right':
                this.remainingMotion = [-Tile.TILESIZE, 0];
                break;
            default:
                return;
        }

        this.motionCallback = callback;
    }

    canOccupy(row, column) {
        if (row < 0 || row >= this.board.length) {
            return false;
        }

        if (column < 0 || column >= this.board[0].length) {
            return false;
        }

        const tile = this.board[row][column];

        if (tile.object && tile.object.type === 'stone') {
            return false;
        }

        return true;
    }

    updateLamp(row, column, darkBoard) {
        const tile = this.board[row][column];

        if (tile.object && tile.object.type === 'off-lamp') {
            tile.object.type = 'on-lamp';
            darkBoard.addPoint(tile.object, 30);

            this.remainingLanterns--;
            lanternsCounter.innerText = this.remainingLanterns;

            if (this.remainingLanterns === 0) {
                this.winCallback();
            }
        }
    }

    doMotionFrame(darkBoard) {
        if (this.remainingMotion[0] || this.remainingMotion[1]) {
            this.context.globalCompositeOperation = 'copy';

            const dx = this.remainingMotion[0] ? Math.sign(this.remainingMotion[0]) * Board.MOTIONSPEED : 0;
            const dy = this.remainingMotion[1] ? Math.sign(this.remainingMotion[1]) * Board.MOTIONSPEED : 0;

            this.context.drawImage(this.canvas, dx, dy);

            this.remainingMotion[0] = this.remainingMotion[0] - dx;
            this.remainingMotion[1] = this.remainingMotion[1] - dy;

            this.context.globalCompositeOperation = 'source-over';

            if (!(this.remainingMotion[0] || this.remainingMotion[1])) {
                this.motionCallback();
            }
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    fullRender() {
        Board.WIDTH = MAP[0].length;
        Board.HEIGHT = MAP.length;

        this.canvas.width = Board.WIDTH * Tile.TILESIZE;
        this.canvas.height = Board.HEIGHT * Tile.TILESIZE;

        this.render();
    }
}

class DarkBoard {
    constructor(canvas, context, player) {
        this.canvas = canvas;
        this.context = context;

        this.canvas.width = Board.WIDTH * Tile.TILESIZE;
        this.canvas.height = Board.HEIGHT * Tile.TILESIZE;

        this.player = player;

        this.points = [[player, 48]];
    }

    convertPoint(row, column) {
        const x = (column - this.player.column) * Tile.TILESIZE + (Board.WIDTH * Tile.TILESIZE) / 2;
        const y = (row - this.player.row) * Tile.TILESIZE + (Board.HEIGHT * Tile.TILESIZE) / 2;

        return [x, y];
    }

    addPoint(object, radius) {
        this.points.push([object, radius]);
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.globalCompositeOperation = 'source-over';

        for (const [object, radius] of this.points) {
            const { row, column } = object;

            const [ x, y ] = this.convertPoint(row, column);

            this.context.beginPath();
            this.context.arc(x, y, radius, 0, 2 * Math.PI, false);
            this.context.fill();
            this.context.closePath();
        }

        this.context.fillStyle = 'black';

        this.context.globalCompositeOperation = 'xor';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    hide() {
        this.canvas.classList.add('hide');
    }
}