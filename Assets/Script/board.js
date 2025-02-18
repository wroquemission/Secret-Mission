const MAP = [
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

class Board {
    static WIDTH = 7;
    static HEIGHT = 5;
    static MOTIONSPEED = 4;

    constructor(canvas, context, player, images) {
        this.canvas = canvas;
        this.context = context;

        this.canvas.width = Board.WIDTH * Tile.TILESIZE;
        this.canvas.height = Board.HEIGHT * Tile.TILESIZE;

        this.player = player;
        this.images = images;

        this.board = this.generateBoard(MAP);

        this.remainingMotion = [0, 0];
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
                    object = new GameObject('stone', this.canvas, this.context, this.images);
                } else if (column === 3) {
                    object = new GameObject('off-lamp', this.canvas, this.context, this.images);
                }

                const tile = new Tile(this.canvas, this.context, object, this.images);

                boardRow.push(tile);
            }

            board.push(boardRow);
        }

        return board;
    }

    render() {
        const rowOffset = Math.floor(this.player.row - Board.HEIGHT / 2) + 1;
        const colOffset = Math.floor(this.player.column - Board.WIDTH / 2) + 1;

        const rowLength = Math.min(rowOffset + Board.HEIGHT, this.board.length) - rowOffset;
        const colLength = Math.min(colOffset + Board.WIDTH, this.board[0].length) - colOffset;

        for (let i = 0; i < rowLength; i++) {
            if (i + rowOffset < 0) continue;

            for (let j = 0; j < colLength; j++) {
                if (j + colOffset < 0) continue;

                const x = j * Tile.TILESIZE;
                const y = i * Tile.TILESIZE;

                const tile = this.board[i + rowOffset][j + colOffset];

                tile.render(x, y);

                if (tile.object) {
                    tile.object.render(x, y);
                }
            }
        }
    }

    move(direction) {
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
        }
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

    doMotionFrame() {
        if (this.remainingMotion[0] || this.remainingMotion[1]) {
            this.context.globalCompositeOperation = 'copy';

            const dx = this.remainingMotion[0] ? Math.sign(this.remainingMotion[0]) * Board.MOTIONSPEED : 0;
            const dy = this.remainingMotion[1] ? Math.sign(this.remainingMotion[1]) * Board.MOTIONSPEED : 0;

            this.context.drawImage(this.canvas, dx, dy);

            this.remainingMotion[0] = this.remainingMotion[0] - dx;
            this.remainingMotion[1] = this.remainingMotion[1] - dy;

            this.context.globalCompositeOperation = 'source-over';

            if (!(this.remainingMotion[0] || this.remainingMotion[1])) {
                this.render();
            }
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class DarkBoard {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;

        this.canvas.width = Board.WIDTH * Tile.TILESIZE;
        this.canvas.height = Board.HEIGHT * Tile.TILESIZE;

        this.context.globalCompositeOperation = 'xor';

        this.points = [];
    }

    addPoint(x, y, radius) {
        this.points.push([x, y, radius]);
    }

    render() {
        for (const [x, y, radius] of this.points) {
            this.context.beginPath();
            this.context.arc(x, y, radius, 0, 2 * Math.PI, false);
            this.context.fill();
            this.context.closePath();
        }

        this.context.fillStyle = 'black';

        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}