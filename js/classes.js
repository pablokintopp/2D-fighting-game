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
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
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
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false

        for (let sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw()

        if (this.dead === false) {
            this.animateFrames()
        }

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

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
            this.setCurrentSprite(this.sprites.attack1)
            this.isAttacking = true
        }
    }

    takeHit(damage) {
        this.health -= damage

        if (this.health > 0) {
            this.setCurrentSprite(this.sprites.takeHit)
        } else {
            this.setCurrentSprite(this.sprites.death)
        }

    }

    setCurrentSprite(sprite) {

        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent >= this.sprites.death.framesMax - 1) {
                this.dead = true
            }
            return
        }

        if (
            (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) ||
            (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1)
        )
            return

        if (this.image !== sprite.image) {
            this.image = sprite.image
            this.framesMax = sprite.framesMax
            this.framesCurrent = 0
            this.frameAutoRestart = sprite.frameAutoRestart
        }
    }

}