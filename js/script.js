//SETUP
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0,0, canvas.width, canvas.height);

//how fast sprite falls when in the air
const gravity = 0.6;

//ENVIRONMENT
const background1 = new Background({
    position: {
        x: 0,
        y: 0
    },
    img_src: "./img/background_layer_1.png"
})
const background2 = new Background({
    position: {
        x: 0,
        y: 0
    },
    img_src: "./img/background_layer_2.png"
})
const background3 = new Background({
    position: {
        x: 0,
        y: 0
    },
    img_src: "./img/background_layer_3.png"
})

const shop = new Sprite({
    position: {
        x: 550,
        y: 222
    },
    width: 50,
    height: 150,
    img_src: "./img/shop_anim.png",
    scale: 2.75,
    frames: 6
})

//CHARACTERS
const player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue",
    height: 200,
    width: 80,
    img_src: "./img/heroSprite/Idle.png",
    scale: 3,
    frames: 10,
    offset: {
        x: 160,
        y: 50
    },
    sprites: {
        idle: {
            img_src: "./img/heroSprite/Idle.png",
            frames: 10
        },
        run: {
            img_src: "./img/heroSprite/Run.png",
            frames: 8
        },
        up: {
            img_src: "./img/heroSprite/Going_Up.png",
            frames: 3
        },
        down: {
            img_src: "./img/heroSprite/Going_Down.png",
            frames: 3
        },
        attack1: {
            img_src: "./img/heroSprite/Attack1.png",
            frames: 7
        },
        takeHit: {
            img_src: "./img/heroSprite/Take_Hit.png",
            frames: 3
        },
        death: {
            img_src: "./img/heroSprite/Death.png",
            frames: 11
        }
    },
    weapon: {
        offset: {
            x: 75,
            y: 100
        },
        width: 130,
        height: 40
    }
});

const enemy = new Fighter({
    position: {
        x: 800,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "red",
    height: 200,
    width: 65,
    img_src: "./img/wormSprite/Worm/Idle.png",
    scale: 3,
    frames: 9,
    offset: {
        x: 80,
        y: -23
    },
    sprites: {
        idle: {
            img_src: "./img/wormSprite/Worm/Idle.png",
            frames: 9
        },
        run: {
            img_src: "./img/wormSprite/Worm/Walk.png",
            frames: 9
        },
        up: {
            img_src: "./img/wormSprite/Worm/Walk.png",
            frames: 3
        },
        down: {
            img_src: "./img/wormSprite/Worm/Walk.png",
            frames: 3
        },
        attack1: {
            img_src: "./img/wormSprite/Worm/Attack.png",
            frames: 16
        },
        takeHit: {
            img_src: "./img/wormSprite/Worm/Get_Hit.png",
            frames: 3
        },
        death: {
            img_src: "./img/wormSprite/Worm/Death.png",
            frames: 8
        }
    },
    weapon: {
        offset: {
            x: -60,
            y: 120
        },
        width: 130,
        height: 40
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

let timer = 15;
let timerID;

decrementTimer();

animate();

window.addEventListener('keydown', keydowns);

window.addEventListener('keyup', keyups);