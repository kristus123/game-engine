export class CustomVideoStream {
	constructor(videoElement, mimeType) {
		if (!window.ManagedMediaSource && !window.MediaSource) {
    		throw new Error(
        		"CustomVideoStream is not supported in this browser."
    		);
		}

		const MediaSourceClass =
    		window.ManagedMediaSource ||
    		window.MediaSource;

		if (!MediaSourceClass.isTypeSupported(mimeType)) {
    		throw new Error(
        		`MIME type is not supported: ${mimeType}`
    		);
		}
		Hei broder :D:D:D:D:D
		this.video = videoElement;
		this.mimeType = mimeType;

		this.mediaSource = null;
		this.sourceBuffer = null;

		this.queue = [];
	}

	static getMediaSourceClass() {
		return (
    		window.ManagedMediaSource ||
    		window.MediaSource
		);
	}

	async start() {
		const MediaSourceClass =
    		CustomVideoStream.getMediaSourceClass();

		this.mediaSource = new MediaSourceClass();

		this.video.src = URL.createObjectURL(
    		this.mediaSource
		);

		await new Promise((resolve) => {
    		this.mediaSource.addEventListener(
        		"sourceopen",
        		resolve,
        		{ once: true }
    		);
		});

		this.sourceBuffer =
    		this.mediaSource.addSourceBuffer(
        		this.mimeType
    		);
	}

	append(data) {
		this.queue.push(data);
		this.processQueue();
	}

	processQueue() {
		if (!this.sourceBuffer) return;
		if (this.sourceBuffer.updating) return;
		if (!this.queue.length) return;

		const data = this.queue.shift();

		this.sourceBuffer.appendBuffer(data);

		this.sourceBuffer.addEventListener(
    		"updateend",
    		() => this.processQueue(),
    		{ once: true }
		);
	}

	end() {
		if (this.mediaSource?.readyState == "open") {
    		this.mediaSource.endOfStream();
		}
	}

	destroy() {
		this.video.removeAttribute("src");
		this.video.load();

		this.mediaSource = null;
		this.sourceBuffer = null;
		this.queue = [];
	}
}