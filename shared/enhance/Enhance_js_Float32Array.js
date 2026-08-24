export function Enhance_js_Float32Array() {

	Enhance(Float32Array.prototype, "toWav", function (sampleRate) {

		Assert.value(sampleRate)

		const buffer = new ArrayBuffer(44 + this.length * 2)
		const view = new DataView(buffer)

		const write = (offset, string) => {
			for (let i = 0; i < string.length; i++) {
				view.setUint8(offset + i, string.charCodeAt(i))
			}
		}

		write(0, "RIFF")
		view.setUint32(4, 36 + this.length * 2, true)
		write(8, "WAVE")
		write(12, "fmt ")

		view.setUint32(16, 16, true)
		view.setUint16(20, 1, true)
		view.setUint16(22, 1, true)
		view.setUint32(24, sampleRate, true)
		view.setUint32(28, sampleRate * 2, true)
		view.setUint16(32, 2, true)
		view.setUint16(34, 16, true)

		write(36, "data")
		view.setUint32(40, this.length * 2, true)

		for (let i = 0; i < this.length; i++) {
			const sample = Math.max(-1, Math.min(1, this[i]))
			view.setInt16(
				44 + i * 2,
				sample < 0 ? sample * 0x8000 : sample * 0x7fff,
				true
			)
		}

		return new Blob([buffer], { type: "audio/wav" })
	})


}



















