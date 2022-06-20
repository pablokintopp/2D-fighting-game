const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const movementSpeed = 2
const jumpSpeed = 20

const hitDamage = 10

let gameOver = false

class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.isJumping
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //atack box
        if (this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }

    }

    update() {
        this.draw()

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        if (this.position.y + this.velocity.y + this.height > canvas.height) {
            this.velocity.y = 0
            this.isJumping = false
        } else {
            this.isJumping = true
            this.velocity.y += gravity
        }
    }

    attack() {
        if (this.isAttacking === false) {
            this.isAttacking = true
            setTimeout(() => {
                this.isAttacking = false
            }, 100)
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
    },
    color: 'blue',
    offset: { x: 0, y: 0 }
})


const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: { x: -50, y: 0 }
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

let timer = 10
let timerTimeoutId
function decreaseTimer() {
    document.getElementById('timer-value').innerHTML = timer
    if (timer > 0) {
        timer--;
        timerTimeoutId = setTimeout(decreaseTimer, 1000);
    } else {
        determineWinner();
    }
}

function determineWinner() {
    let status = ''
    if (player.health === enemy.health) {
        status = 'GAME TIED!'
    } else if (player.health > enemy.health) {
        status = 'PLAYER 1 WINS!'
    } else {
        status = 'PLAYER 2 WINS!'
    }

    document.getElementById('game-status-value').innerHTML = status
    document.getElementById('game-status-value').style.display = 'block'

    if (timer > 0 && timerTimeoutId) {
        clearTimeout(timerTimeoutId)
    }

    gameOver = true

}

decreaseTimer()

function detectCollisionBetweenRectangles({ rect1, rect2 }) {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y + rect1.height >= rect2.position.y &&
        rect1.position.y <= rect2.position.y + rect2.height)
}

function animate() {
    window.requestAnimationFrame(animate)

    if (gameOver === false) {
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)

        player.update()
        enemy.update()

        player.velocity.x = 0
        enemy.velocity.x = 0

        if (keys.a.pressed && player.lastKey === 'a') {
            player.velocity.x = -movementSpeed
        } else if (keys.d.pressed && player.lastKey === 'd') {
            player.velocity.x = movementSpeed
        }

        if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
            enemy.velocity.x = -movementSpeed
        } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = movementSpeed
        }

        //detect for collision
        if (player.isAttacking &&
            detectCollisionBetweenRectangles({ rect1: player.attackBox, rect2: enemy })
        ) {
            player.isAttacking = false
            enemy.health -= hitDamage
            document.getElementById('enemy-health').style.width = `${enemy.health}%`
        }

        if (enemy.isAttacking &&
            detectCollisionBetweenRectangles({ rect1: enemy.attackBox, rect2: player })
        ) {
            enemy.isAttacking = false
            player.health -= hitDamage
            document.getElementById('player-health').style.width = `${player.health}%`
        }

        if (player.health <= 0 || enemy.health <= 0) {
            determineWinner()
        }
    }

}
animate()

window.addEventListener('keydown', (ev) => {
    //console.log(ev.key)
    switch (ev.key) {
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'w':
            if (player.isJumping == false) {
                player.velocity.y = -jumpSpeed
            }
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowUp':
            if (enemy.isJumping == false) {
                enemy.velocity.y = -jumpSpeed
            }
            break
        case ' ':
            player.attack()
            break
        case 'Control':
            enemy.attack()
            break

        default:
            break
    }
})

window.addEventListener('keyup', (ev) => {
    switch (ev.key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        default:
            break
    }
})