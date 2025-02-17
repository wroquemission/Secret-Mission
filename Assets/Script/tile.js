const grassPath = './Assets/Images/grass.png';

class Tile {
    static TILESIZE = 32;

    constructor(canvas, context, object) {
        this.canvas = canvas;
        this.context = context;
        this.object = object;
    }

    render(x, y) {
        const image = new Image();

        image.onload = () => {
            this.context.drawImage(image, x, y);
        };

        image.src = grassPath;
    }
}