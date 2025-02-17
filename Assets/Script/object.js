const objectPaths = {
    'stone': './Assets/Images/stone.png',
    'off': './Assets/Images/off.png',
    'on': './Assets/Images/on.png'
};

class GameObject {
    constructor(type, canvas, context) {
        this.type = type;
        this.canvas = canvas;
        this.context = context;
    }

    render(x, y) {
        const image = new Image();

        image.onload = () => {
            const imageWidth = image.naturalWidth;
            const imageHeight = image.naturalHeight;

            this.context.drawImage(
                image,
                x + Tile.TILESIZE / 2 - imageWidth / 2,
                y + Tile.TILESIZE / 2 - imageHeight / 2
            );
        };

        image.src = objectPaths[this.type];
    }
}