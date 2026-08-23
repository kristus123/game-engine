export class ContentType {
	static json = "application/json"
	static md = "text/markdown"
	static hls = "application/vnd.apple.mpegurl"
	static hlsAlt = "application/x-mpegURL"
	static mp4 = "video/mp4"
	static webm = "video/webm"
	static ogg = "video/ogg"
	static mpegTs = "video/mp2t"
	static mp3 = "audio/mpeg"
	static wav = "audio/wav"
	static png = "image/png"
	static jpeg = "image/jpeg"
	static gif = "image/gif"
	static webp = "image/webp"
	static svg = "image/svg+xml"
	static html = "text/html"
	static css = "text/css"
	static javascript = "text/javascript"
	static text = "text/plain"
	static pdf = "application/pdf"
	static zip = "application/zip"

	static values = [
		ContentType.json,
		ContentType.md,
		ContentType.hls,
		ContentType.hlsAlt,
		ContentType.mp4,
		ContentType.webm,
		ContentType.ogg,
		ContentType.mpegTs,
		ContentType.mp3,
		ContentType.wav,
		ContentType.png,
		ContentType.jpeg,
		ContentType.gif,
		ContentType.webp,
		ContentType.svg,
		ContentType.html,
		ContentType.css,
		ContentType.javascript,
		ContentType.text,
		ContentType.pdf,
		ContentType.zip
	]

	static extensions = {
		".json": ContentType.json,
		".md": ContentType.md,
		".m3u8": ContentType.hls,
		".ts": ContentType.mpegTs,
		".mp4": ContentType.mp4,
		".webm": ContentType.webm,
		".ogg": ContentType.ogg,
		".mp3": ContentType.mp3,
		".wav": ContentType.wav,
		".png": ContentType.png,
		".jpg": ContentType.jpeg,
		".jpeg": ContentType.jpeg,
		".gif": ContentType.gif,
		".webp": ContentType.webp,
		".svg": ContentType.svg,
		".html": ContentType.html,
		".css": ContentType.css,
		".js": ContentType.javascript,
		".txt": ContentType.text,
		".pdf": ContentType.pdf,
		".zip": ContentType.zip
	}

	static fromFile(file) {
		const extension = file.substring(file.lastIndexOf(".")).toLowerCase()

		if (this.extensions[extension]) {
			return this.extensions[extension]
		}

		throw new Error("error while calling .fromFile, unsupported file type: " + file)
	}

	static parse(value) {
		const parts = []
		let part = ""
		let quoted = false
		let escaped = false

		for (const char of value) {
			if (escaped) {
				part += char
				escaped = false
				continue
			}

			if (char == "\\") {
				part += char
				escaped = true
				continue
			}

			if (char == "\"") {
				quoted = !quoted
				part += char
				continue
			}

			if (char == ";" && !quoted) {
				parts.push(part)
				part = ""
				continue
			}

			part += char
		}

		parts.push(part)

		const contentType = parts.shift().trim()

		if (!this.values.includes(contentType)) {
			throw new Error("error while calling .parse, unsupported content type: " + contentType)
		}

		const parameters = {}

		for (const part of parts) {
			const separator = part.indexOf("=")

			if (separator == -1) {
				continue
			}

			const key = part.substring(0, separator).trim()
			let parameterValue = part.substring(separator + 1).trim()

			if (
				parameterValue.startsWith("\"") &&
				parameterValue.endsWith("\"")
			) {
				parameterValue = parameterValue
					.substring(1, parameterValue.length - 1)
					.replace(/\\"/g, "\"")
					.replace(/\\\\/g, "\\")
			}

			parameters[key] = parameterValue
		}

		return {
			name: contentType,
			parameters: parameters
		}
	}
}
