
const sleep = ms => new Promise(r => setTimeout(r, ms));

self.onmessage = e => {
	// sleep(1000)

    const width = e.data.width;
    const height = e.data.height;
    const translate = e.data.translate
    let x = e.data.x
    let y = e.data.y

    const offscreenCanvas = new OffscreenCanvas(width, height);
    const offscreenCtx = offscreenCanvas.getContext("2d");

	offscreenCtx.translate(translate.x, translate.y);

	offscreenCtx.fillStyle = "yellow";
	offscreenCtx.fillRect(x, y, width, height);
	x += 0.1
	y += 0.1

	// Convert the OffscreenCanvas to an ImageBitmap
	const bitmap = offscreenCanvas.transferToImageBitmap()

	// Send the ImageBitmap back to the main thread
	self.postMessage({bitmap, x, y}, [bitmap]);
};
