class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale)
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed >= this.framesHold) {
            this.framesCurrent = this.framesCurrent < (this.framesMax - 1) ? this.framesCurrent + 1 : 0
            this.framesElapsed = 0
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }

}
class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        offset = { x: 0, y: 0 },
        imageSrc,
        scale = 1,
        framesMax = 1,
        sprites
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

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
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites

        for (let sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    // draw() { 
    //     //atack box
    //     if (this.isAttacking) {
    //         c.fillStyle = 'green'
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    //     }
    // }

    update() {
        this.draw()
        this.animateFrames()

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        if (this.position.y + this.velocity.y + this.height > canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 331 // ground
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

    setCurrentSprite(sprite) {
        if (this.image !== sprite.image) {
            this.image = sprite.image
            this.framesMax = sprite.framesMax
            this.framesCurrent = 0
        }
    }

}