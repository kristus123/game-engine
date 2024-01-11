export class BloodEffect {
    constructor(scale = 5, frameDuration = 100) {
        this.gif = new Image();
        this.gif.src = '/static/assets/blood/blood_pack_1/VFX Blood Batch 1_1.gif';

        this.scale = scale;
        this.frameDuration = frameDuration;

        this.currentFrame = 0;
        this.lastFrameTime = 0;

        this.totalFrames = 0;

        this.gif.onload = () => {
            this.totalFrames = Math.floor(this.gif.width / this.gif.height);
            this.animate();
        };
    }

    animate() {
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;

        if (elapsed > this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
			console.log(this.currentFrame)
            this.lastFrameTime = now;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.draw(ctx);

            requestAnimationFrame(() => this.animate());
        } else {
            requestAnimationFrame(() => this.animate());
        }
    }

    draw(ctx) {
        const frameWidth = this.gif.width / this.totalFrames;
        ctx.drawImage(
            this.gif,
            frameWidth * this.currentFrame,
            0,
            frameWidth,
            this.gif.height,
            -1200,
            0,
            frameWidth * this.scale,
            this.gif.height * this.scale
        );
    }
}

