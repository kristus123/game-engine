export function Enhance_js_Blob() {

	Enhance(Blob.prototype, "toWav", async function () {

		function writeString(view, offset, string) {
			for (let i = 0; i < string.length; i++) {
				view.setUint8(offset + i, string.charCodeAt(i))
			}
		}

		function encodeWav(audioBuffer) {
			const channels = audioBuffer.numberOfChannels
			const sampleRate = audioBuffer.sampleRate
			const samples = audioBuffer.length

			const buffer = new ArrayBuffer(44 + samples * channels * 2)
			const view = new DataView(buffer)

			writeString(view, 0, "RIFF")
			view.setUint32(4, 36 + samples * channels * 2, true)
			writeString(view, 8, "WAVE")
			writeString(view, 12, "fmt ")
			view.setUint32(16, 16, true)
			view.setUint16(20, 1, true)
			view.setUint16(22, channels, true)
			view.setUint32(24, sampleRate, true)
			view.setUint32(28, sampleRate * channels * 2, true)
			view.setUint16(32, channels * 2, true)
			view.setUint16(34, 16, true)
			writeString(view, 36, "data")
			view.setUint32(40, samples * channels * 2, true)

			for (let i = 0; i < samples; i++) {
				for (let channel = 0; channel < channels; channel++) {
					const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]))
					const offset = 44 + (i * channels + channel) * 2
					view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
				}
			}

			return buffer
		}

		const audioBuffer = await new AudioContext().decodeAudioData(await this.arrayBuffer())

		return new Blob([encodeWav(audioBuffer)], {
			type: "audio/wav",
		})
	})
}
