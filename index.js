const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.isJumping
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if (this.position.y + this.velocity.y + this.height > canvas.height) {
            this.velocity.y = 0
            this.isJumping = false;
        } else {
            this.isJumping = true;
            this.velocity.y += gravity
        }
    }

}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})


const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -1
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 1
    }

    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -1
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 1
    }

}
animate()

window.addEventListener('keydown', (ev) => {
    console.log(ev.key)
    switch (ev.key) {
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'w':
            if (player.isJumping == false) {
                player.velocity.y = -20
            }
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowUp':
            if (enemy.isJumping == false) {
                enemy.velocity.y = -20
            }
            break;

        default:
            break;
    }
})

window.addEventListener('keyup', (ev) => {
    switch (ev.key) {
        case 'a':
            keys.a.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        default:
            break;
    }
})