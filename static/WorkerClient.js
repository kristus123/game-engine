/*
 * the  offscreenCanvas  uses relative positions. makes sense as it is not connected to the dom.
 *
	*/
class WorkerClient {
	constructor() {
		this.worker = new Worker("static/w.js")
		this.position = {
			x: 0,
			y: 0,
		}
		this.workerBitMap = null

		this.worker.onmessage = e => {
			this.workerBitMap = e.data;

			this.position.x += 1
			this.position.y += 1
		}

		setInterval(() => {
			this.worker.postMessage('ho');
		}, 200)
	}

	// So when positioning the drawn image on the 'global map' 
	// you need to set the position when drawing
	draw(ctx) {
		if (this.workerBitMap) {
			ctx.drawImage(this.workerBitMap, this.position.x, this.position.y)
		}
	}
	
}
