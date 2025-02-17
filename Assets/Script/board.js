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

    constructor(canvas, context, player, images) {
        this.canvas = canvas;
        this.context = context;

        this.canvas.width = Board.WIDTH * Tile.TILESIZE;
        this.canvas.height = Board.HEIGHT * Tile.TILESIZE;

        this.player = player;
        this.images = images;

        this.board = this.generateBoard(MAP);
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

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class DarkBoard {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.context.globalCompositeOperation = 'xor';
    }

    render(x, y, radius) {
    }
}