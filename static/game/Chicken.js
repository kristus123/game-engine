
export class Chicken extends GameObject {
    constructor() {
        super(-1500, -400, 150, 150, 10, 10)
        this.picture = new Picture(this, '/static/assets/Chicken_Sprite_Sheet.png')

        new Sprite(this)

    }

    onCollision(o) {
        Push(this).awayFrom(o, 50)
    }

    update() {
    }

    draw(ctx) {
        this.picture.old_draw(ctx, 100)


    }
}
