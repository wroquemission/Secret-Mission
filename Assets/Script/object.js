class GameObject {
    constructor(type, canvas, context, images) {
        this.type = type;
        this.canvas = canvas;
        this.context = context;
        this.images = images;
    }

    render(x, y) {
        const image = this.images[this.type];
        const imageWidth = image.naturalWidth;
        const imageHeight = image.naturalHeight;

        this.context.drawImage(
            image,
            x + Tile.TILESIZE / 2 - imageWidth / 2,
            y + Tile.TILESIZE / 2 - imageHeight / 2
        );
    }
}