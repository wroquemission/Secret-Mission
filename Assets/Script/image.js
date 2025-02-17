function loadImage(path) {
    return new Promise(resolve => {
        const image = new Image();
        image.src = path;

        image.onload = () => {
            resolve(image);
        };
    });
}

const imagePaths = {
    'stone': './Assets/Images/stone.png',
    'off-lamp': './Assets/Images/off.png',
    'on-lamp': './Assets/Images/on.png',
    'grass':  './Assets/Images/grass.png',
    'player-1': './Assets/Images/player-1.png',
    'player-2': './Assets/Images/player-2.png',
    'player-3': './Assets/Images/player-3.png',
    'player-4': './Assets/Images/player-4.png',
    'player-5': './Assets/Images/player-5.png',
    'player-6': './Assets/Images/player-6.png',
    'player-7': './Assets/Images/player-7.png',
    'player-8': './Assets/Images/player-8.png'
};

function loadImages() {
    return new Promise(resolve => {
        let keys = [];
        let promises = [];

        for (const key in imagePaths) {
            keys.push(key);
            promises.push(loadImage(imagePaths[key]));
        }

        Promise.all(promises).then(values => {
            let images = {};

            for (let i = 0; i < values.length; i++) {
                images[keys[i]] = values[i];
            }

            resolve(images);
        });
    });
}