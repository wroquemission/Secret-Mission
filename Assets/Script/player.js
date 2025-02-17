
class Player {
    static FRAMECOUNT = 7;

    constructor(canvas, context, images) {
        this.canvas = canvas;
        this.context = context;

        this.images = this.getImages(images);

        this.row = undefined;
        this.column = undefined;
    }

    getImages(images) {
        let playerImages = [];

        for (const key in images) {
            if (key.startsWith('player-')) {
                playerImages.push(images[key]);
            }
        }

        return playerImages;
    }

    render(frameNum) {
        if (frameNum % Player.FRAMECOUNT === 0) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const index = Math.floor(
                (frameNum % (this.images.length * Player.FRAMECOUNT)) / Player.FRAMECOUNT
            );

            const image = this.images[index];

            this.context.drawImage(
                image,
                this.canvas.width / 2 - image.naturalWidth / 2,
                this.canvas.height / 2 - image.naturalHeight / 2,
            );
        }
    }
}