export class Vad {
	constructor({ onStart, onEnd } = {}) {

		Mic.request(() => {
			vad.MicVAD.new({
				onSpeechStart: () => {
					console.log("Speech start detected")
					onStart?.()
				},
				onSpeechEnd: float32Array => {
					onEnd(float32Array.toWav())
				},
				onnxWASMBasePath: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
				baseAssetPath: "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",
			}).then(x => x.start())
		})

	}
}
