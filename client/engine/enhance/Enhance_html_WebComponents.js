function _register(tagName) {
	class EmptyElement extends HTMLElement {}
	customElements.define(tagName, EmptyElement)
}

export function Enhance_html_WebComponents() {

	customElements.define("video-div", class extends HTMLElement {
		constructor() {
			super() //required

			const video = document.createElement("video")

			const src = this.getAttribute("src")
			if (src) {
				video.src = src
			}

			video.autoplay = true
			video.muted = true
			video.loop = true
			video.playsInline = true

			const overlay = document.createElement("div")
			overlay.classList.add("overlay")

			const content = document.createElement("div")
			content.classList.add("content")
			content.classList.add("center")

			while (this.firstChild) {
				content.appendChild(this.firstChild)
			}

			this.appendChild(video)
			this.appendChild(overlay)
			this.appendChild(content)
		}
	})


	customElements.define("local-cam", class extends HTMLElement {
		connectedCallback() {
			const video = document.createElement("video");

			video.autoplay = true;
			video.muted = true;

			this.appendChild(video);
		}
	})

	customElements.define("guest-cam", class extends HTMLElement {
		connectedCallback() {
			const video = document.createElement("video");

			video.autoplay = true;

			this.appendChild(video);
		}
	})

}
