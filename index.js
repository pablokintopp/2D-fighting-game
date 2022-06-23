const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const movementSpeed = 2
const jumpSpeed = 20

const hitDamage = 10

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 620,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.78,
    framesMax: 6
})


const player = new Fighter({
    position: {
        x: 100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: { x: 215, y: 157 },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: { x: 60, y: 10 },
        width: 170,
        height: 90
    }
})


const enemy = new Fighter({
    position: {
        x: 800,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: { x: 215, y: 167 },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: { x: -150, y: 30 },
        width: 170,
        height: 90
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

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()

    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    if (keys.a.pressed && player.lastKey === 'a') {
        player.setCurrentSprite(player.sprites.run)
        player.velocity.x = -movementSpeed
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.setCurrentSprite(player.sprites.run)
        player.velocity.x = movementSpeed
    } else {
        player.setCurrentSprite(player.sprites.idle)
    }

    if (player.velocity.y < 0) {
        player.setCurrentSprite(player.sprites.jump);
    } else if (player.velocity.y > 0) {
        player.setCurrentSprite(player.sprites.fall);
    }

    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.setCurrentSprite(enemy.sprites.run)
        enemy.velocity.x = -movementSpeed
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = movementSpeed
        enemy.setCurrentSprite(enemy.sprites.run)
    } else {
        enemy.setCurrentSprite(enemy.sprites.idle)
    }

    if (enemy.velocity.y < 0) {
        enemy.setCurrentSprite(enemy.sprites.jump);
    } else if (enemy.velocity.y > 0) {
        enemy.setCurrentSprite(enemy.sprites.fall);
    }

    //Detect attack player one
    if (player.isAttacking && player.framesCurrent === 4 // frame 4 is when the player 1 draws his sword            
    ) {
        player.isAttacking = false
        if (detectCollisionBetweenRectangles({ rect1: player.attackBox, rect2: enemy })) {
            enemy.takeHit(hitDamage)
            document.getElementById('enemy-health').style.width = `${enemy.health}%`
        }
    }

    if (enemy.isAttacking && enemy.framesCurrent === 2 // frame 2 is when the player 2 draws his sword            
    ) {
        enemy.isAttacking = false
        if (detectCollisionBetweenRectangles({ rect1: enemy.attackBox, rect2: player })) {
            player.takeHit(hitDamage)
            document.getElementById('player-health').style.width = `${player.health}%`
        }

    }

    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner()
    }


}
animate()

window.addEventListener('keydown', (ev) => {
    //console.log(ev.key)
    if (player.dead === false) {
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
            default:
                break
        }
    }

    if (enemy.dead === false) {
        switch (ev.key) {
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
            case 's':
                player.attack()
                break
            case 'ArrowDown':
                enemy.attack()
                break

            default:
                break
        }
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