export class Sound {

	static async playBlob(blob) {
		const url = URL.createObjectURL(blob)
		new Audio(url).play()
	}

}
