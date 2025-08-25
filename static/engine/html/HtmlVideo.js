export class HtmlVideo {

	static localVideo(srcObject) {
		const video = HtmlElement('video')
		video.autoplay = true
		video.muted = true
		video.srcObject = srcObject

		return video
	}

	static guestVideo(srcObject) {
		const video = HtmlElement('video')
		video.autoplay = true
		video.srcObject = srcObject

		return video
	}
}
