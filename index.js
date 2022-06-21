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

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})


const player = new Fighter({
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


const enemy = new Fighter({
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

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)

    if (gameOver === false) {
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)

        background.update()
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