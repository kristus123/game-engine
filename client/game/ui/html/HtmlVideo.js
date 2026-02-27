export class HtmlVideo {

	static local(srcObject) {
		const video = HtmlElement("video")
		video.autoplay = true
		video.muted = true
		video.srcObject = srcObject

		return video
	}

	static guest(srcObject) {
		const video = HtmlElement("video")
		video.autoplay = true
		video.srcObject = srcObject

		return video
	}
}
