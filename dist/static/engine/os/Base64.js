import { a } from '/static/engine/assertions/a.js'; 

export class Base64 {

	static encode(blob, callback) {
		const reader = new FileReader()

		reader.onloadend = () => callback(reader.result)
		reader.onerror = e => callback(null, e)

		reader.readAsDataURL(blob)
	}

	static decode(dataUrl) {
		const [meta, base64] = dataUrl.split(',')
		const mime = meta.match(/:(.*?);/)[1]

		const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))

		return new Blob([bytes], { type: mime })

	}
}
