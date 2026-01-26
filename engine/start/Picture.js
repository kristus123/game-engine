export class Picture {

	constructor(image) {
    	this.canvas = document.createElement('canvas')
    	this.ctx = this.canvas.getContext('2d')

    	this.canvas.width = image.naturalWidth
    	this.canvas.height = image.naturalHeight

    	this.ctx.drawImage(image, 0, 0)
	}

	clear() {
    	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}


	setPixel(p, r = 255, g = 255, b = 255, a = 255) {
    	this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`

    	this.ctx.fillRect(p.x, p.y, p.width, p.height)
	}

	update(position, frame) {
    	D1.sprite(position, frame, this.canvas)
	}
}
