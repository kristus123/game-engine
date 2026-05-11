export class Sound {
	static init() {}
	static playBlob(blob) {
		const url = URL.createObjectURL(blob)
		const audio = new Audio(url)

		audio.play()
	}

}
