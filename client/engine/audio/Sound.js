export class Sound {
<<<<<<< HEAD
	static init() {}
	
||||||| parent of 3a3b100d (x)
	static init() {}
=======

>>>>>>> 3a3b100d (x)
	static playBlob(blob) {
		const url = URL.createObjectURL(blob)
		const audio = new Audio(url)

		audio.play()
	}

}
