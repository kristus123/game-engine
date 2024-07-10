// todo ignore for now
export class DarkenArea {
    constructor(position) {
    }

    draw(draw, guiDraw) {
		const ctx = draw.ctx

		const x = 100
		const y = 100

        const { width, height } = this.position;
        const imageData = ctx.getImageData(x, y , 100, 100);
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
            data[i] = 0 //Math.max(0, data[i] - 50);     // Red
            data[i + 1] = 0  // = Math.max(0, data[i + 1] - 50); // Green
            data[i + 2] = Math.max(0, data[i + 2] - 50); // Blue
            // data[i + 3] is the alpha value, we leave it unchanged
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

