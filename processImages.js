const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async () => {
    await imagemin(['./frames/*.jpg'], {
        destination: './assets/frames/',
        plugins: [
            imageminMozjpeg({
                quality: 40
            }),
        ]
    });

    console.log('Images optimized');
})();