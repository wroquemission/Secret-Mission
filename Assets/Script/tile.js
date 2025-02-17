class Tile {
    static TILESIZE = 32;

    constructor(canvas, context, object, images) {
        this.canvas = canvas;
        this.context = context;
        this.object = object;
        this.image = images['grass'];
    }

    render(x, y) {
        this.context.drawImage(this.image, x, y);
    }
}