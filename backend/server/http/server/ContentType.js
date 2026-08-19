export class ContentType {
	static json = 'application/json'
	static hls = 'application/vnd.apple.mpegurl'
	static hlsAlt = 'application/x-mpegURL'
	static mp4 = 'video/mp4'
	static webm = 'video/webm'
	static ogg = 'video/ogg'
	static mpegTs = 'video/mp2t'
	static mp3 = 'audio/mpeg'
	static wav = 'audio/wav'
	static png = 'image/png'
	static jpeg = 'image/jpeg'
	static gif = 'image/gif'
	static webp = 'image/webp'
	static svg = 'image/svg+xml'
	static html = 'text/html'
	static css = 'text/css'
	static javascript = 'text/javascript'
	static text = 'text/plain'
	static pdf = 'application/pdf'
	static zip = 'application/zip'

	static extensions = {
		'.json': ContentType.json,
		'.m3u8': ContentType.hls,
		'.ts': ContentType.mpegTs,
		'.mp4': ContentType.mp4,
		'.webm': ContentType.webm,
		'.ogg': ContentType.ogg,
		'.mp3': ContentType.mp3,
		'.wav': ContentType.wav,
		'.png': ContentType.png,
		'.jpg': ContentType.jpeg,
		'.jpeg': ContentType.jpeg,
		'.gif': ContentType.gif,
		'.webp': ContentType.webp,
		'.svg': ContentType.svg,
		'.html': ContentType.html,
		'.css': ContentType.css,
		'.js': ContentType.javascript,
		'.txt': ContentType.text,
		'.pdf': ContentType.pdf,
		'.zip': ContentType.zip
	}

	static fromFile(file) {
		const extension = file.substring(file.lastIndexOf('.')).toLowerCase()
		if (this.extensions[extension]) {
			return this.extensions[extension]
		}
		else {
			throw new Error("unsupported file type: " + file)
		}
	}

	static assertSupported(contentType) {
		throw new Error("gpt implement")
	}

}
