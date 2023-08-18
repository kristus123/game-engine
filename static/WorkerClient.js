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
	}

	onmessage() {
		let workerBitMap = null
		let coordinates = {x:0, y:0}

		const worker = new WorkerClient()
		worker.onmessage = e => {
			workerBitMap = e.data;
			coordinates.x += 1
			coordinates.y += 1
			console.log(coordinates)
		};
		setInterval(() => {
			worker.postMessage({ width, height, coordinates });
		}, 200)
		
	}

	// So when positioning the drawn image on the 'global map' 
	// you need to set the position when drawing
	draw(ctx) {
		hiddenCtx.drawImage(ctx, this.position.x, this.position.y)
	}
	
}
