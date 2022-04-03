class Background {
    constructor({
        position,
        img_src
    }) {
        this.position = position;
        this.img = new Image();
        this.img.src = img_src;
    }

    createBackground() {
        context.drawImage(this.img, this.position.x, this.position.y, 1024, 576);
    }
}

class Sprite {
    constructor({
        position,
        img_src,
        width,
        height,
        scale = 1,
        frames = 1,
        offset = {
            x: 0,
            y: 0
        }
    }) {
        this.position = position;
        this.height = height;
        this.width = width;
        this.img = new Image();
        this.img.src = img_src;
        this.scale = scale;
        this.frames = frames;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 6;
        this.offset = offset;
    }

    draw() {
        //display character position box
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.drawImage(
            this.img,
            this.frameCurrent * (this.img.width / this.frames),
            0,
            this.img.width / this.frames,
            this.img.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.img.width / this.frames) * this.scale,
            this.img.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.frames - 1) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'white',
        img_src,
        width,
        height,
        scale = 1,
        frames = 1,
        offset = {
            x: 0,
            y: 0
        },
        weapon = {
            offset: {

            },
            width: undefined,
            height: undefined
        },
        sprites
    }) {
        super({
            position,
            img_src,
            scale,
            frames,
            offset
        });

        this.position = position;
        this.velocity = velocity;
        this.lastKey;
        this.height = height;
        this.width = width;
        this.weapon = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: weapon.offset,
            width: weapon.width,
            height: weapon.height
        };
        this.color = color;
        this.isAttacking = false;
        this.takingHit = false;
        this.isDead = false;
        this.health = 100;

        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;

        for (const sprite in this.sprites) {
            sprites[sprite].img = new Image();
            sprites[sprite].img.src = sprite.img_src;
        }
    }

    update() {
        this.draw();
        //if sprite is dead, stop animationFrames method
        if(this.isDead && this.frameCurrent === this.sprites.death.frames - 1) {
            return;
        }

        this.animateFrames();

        this.weapon.position.x = this.position.x + this.weapon.offset.x;
        this.weapon.position.y = this.position.y + this.weapon.offset.y;

        //display weapon box
        // context.fillRect(this.weapon.position.x, this.weapon.position.y, this.weapon.width, this.weapon.height);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            this.position.y = 376;
        } else {
            this.velocity.y += gravity;
        }
    }

    switchSprite(sprite) {
        //override all other animations when fighter gets hit
        if (this.takingHit && this.frameCurrent < this.sprites.takeHit.frames - 1) return;
        //override all other animations when fighter is attacking
        if (this.isAttacking && this.frameCurrent < this.sprites.attack1.frames - 1) return;

        switch (sprite) {
            case "idle":
                if (this.img.src !== this.sprites.idle.img_src) {
                    this.img.src = this.sprites.idle.img_src;
                    this.frames = this.sprites.idle.frames;
                }
                break;
            case "run":
                if (this.img.src !== this.sprites.run.img_src) {
                    this.img.src = this.sprites.run.img_src;
                    this.frames = this.sprites.run.frames;
                }
                break;
            case "up":
                if (this.img.src !== this.sprites.up.img_src) {
                    this.img.src = this.sprites.up.img_src;
                    this.frames = this.sprites.up.frames;
                }
                break;
            case "down":
                if (this.img.src !== this.sprites.down.img_src) {
                    this.img.src = this.sprites.down.img_src;
                    this.frames = this.sprites.down.frames;
                }
                break;
            case "attack1":
                if (this.img.src !== this.sprites.attack1.img_src) {
                    this.img.src = this.sprites.attack1.img_src;
                    this.frames = this.sprites.attack1.frames;
                    this.frameCurrent = 0;
                }
                break;
            case "takeHit":
                if (this.img.src !== this.sprites.takeHit.img_src) {
                    this.img.src = this.sprites.takeHit.img_src;
                    this.frames = this.sprites.takeHit.frames;
                    this.frameCurrent = 0;
                }
                break;
            case "death":
                if (this.img.src !== this.sprites.death.img_src) {
                    this.img.src = this.sprites.death.img_src;
                    this.frames = this.sprites.death.frames;
                }
                break;
        }
    }

    attack() {
        this.switchSprite("attack1");
        this.isAttacking = true;
    }

    takeHit() {
        this.switchSprite("takeHit");
        this.takingHit = true;
        this.health -= 10
    }

    dead() {
        this.switchSprite("death");
        this.isDead = true;
    }
}