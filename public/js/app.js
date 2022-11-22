const socket = io('ws://localhost:3000');

const app = {

    init() {
        console.log('App initialized');

        socket.on('message', (message) => {
            console.log(message);
        });

        socket.on('draw', (data) => {
            // [1,2,3,'test'] ---> line(1,2,3,'test')
            line(...Object.values(data));
        });

        const coloPicker = document.querySelector('#color-picker');
        const strokeSize = document.querySelector('#stroke-size');
        coloPicker.addEventListener('change', app.changeColor);
        strokeSize.addEventListener('change', app.changeStrokeSize);
    },

    changeColor(event) {
        const currentColor = event.target.value;
        stroke(currentColor);
    },

    changeStrokeSize(event) {
        const currentStrokeSize = event.target.value;
        strokeWeight(currentStrokeSize);
    },

};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// eslint-disable-next-line no-unused-vars
function setup() {
    // Calcul de la largeur
    const asideDiv = document.querySelector('aside');
    const asideWidth = asideDiv.offsetWidth;
    const screenWidth = window.innerWidth;
    const margin = 30;
    const canvasWidth = screenWidth - asideWidth - margin * 3;

    // Calcul de la hauteur
    const headerDiv = document.querySelector('header');
    const headerHeight = headerDiv.offsetHeight;
    const screenHeight = window.innerHeight;
    const canvasHeight = screenHeight - headerHeight - margin * 2;

    createCanvas(canvasWidth, canvasHeight);
    stroke(255, 255, 255);
}

// eslint-disable-next-line no-unused-vars
function draw() {
    // mouseIsPressed
    // mouseX, mouseY
    if (mouseIsPressed) {
        /**
         * @param mouseX coordonnée X de la souris au moment ou l'on appui sur le bouton gauche
         * @param mouseY coordonnée Y de la souris au moment ou l'on appui sur le bouton gauche
         * @param pmouseX coordonnée X de la souris au moment ou l'on relache le bouton gauche
         * @param pmouseY coordonnée Y de la souris au moment ou l'on relache le bouton gauche
         */
        line(mouseX, mouseY, pmouseX, pmouseY);
        socket.emit('draw', {
            mouseX, mouseY, pmouseX, pmouseY,
        });
    }
}
