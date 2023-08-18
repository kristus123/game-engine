if( 'function' === typeof importScripts) {
   importScripts('Draw.js');
}

const offscreenCanvas = new OffscreenCanvas(200, 200);
const offscreenCtx = offscreenCanvas.getContext('2d');

self.onmessage = e => {
	offscreenCtx.clearRect(0, 0, 200, 200);

	Draw.circle(offscreenCtx, 40, 40, 40, 'yellow')

	const bitmap = offscreenCanvas.transferToImageBitmap();

	self.postMessage(bitmap, [bitmap]);
}

