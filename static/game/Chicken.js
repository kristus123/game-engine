
export class Chicken extends GameObject {
    constructor() {
        super(-1500, -400, 150, 150, 10, 10)

        this.sprite = new Sprite('/static/assets/Chicken_Sprite_Sheet.png', this)

    }

    onCollision(o) {
        Push(this).awayFrom(o, 50)
    }

    update() {
    }

    draw(ctx) {
        this.sprite.draw(ctx)

    }
}
