export class Factory extends GameObject {

    constructor(player) {
        super(-1500, -300, 150, 150, 100, 10)
        this.player = player
    }

    onFinish() {

    }

    update() {
        if (Collision.between(this.player, this)) {
            this.onFinish()
        }
    }

    draw(ctx) {
        super.draw(ctx)
    }
}
