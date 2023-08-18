if( 'function' === typeof importScripts) {
   importScripts('Draw.js');
   importScripts('Camera.js');
}

let c = null
let cccctx = null

let pleyer = null

let wii = null
let hee = null

self.onmessage = e => {
	if (e.data.type === 'init') {
		c = e.data.canvas
		cccctx = c.getContext('2d');
		wii = e.data.width
		hee = e.data.height
		pleyer = e.data.player
	}


 const particleCount = 20 // Adjust this to control the number of particles

  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * 4000
    const y = Math.random() * 4000
    const radius = Math.random() * 5 + 1;
    const color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;

    cccctx.beginPath();
    cccctx.arc(x, y, radius, 0, Math.PI * 2);
    cccctx.fillStyle = color;
    cccctx.fill();
    cccctx.closePath();
  }















	const bitmap = c.transferToImageBitmap()
	self.postMessage(bitmap, [bitmap]);
}

