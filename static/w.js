if( 'function' === typeof importScripts) {
   importScripts('Draw.js');
}


let c = null

self.onmessage = e => {
	if (e.data.type === 'init') {
		c = e.data.canvas
	}

	cccctx = c.getContext('2d');

	Draw.circle(cccctx, 40, 40, 40, 'yellow')

	const bitmap = c.transferToImageBitmap()

	self.postMessage(bitmap, [bitmap]);
}

