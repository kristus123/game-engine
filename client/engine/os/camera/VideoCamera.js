export class VideoCamera {

	static async get() {
		return await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
	}

	static async request(callback) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true }, {audio: true});

			stream.getTracks().forEach(track => track.stop());

			console.log("Camera permission granted (then closed).");
			callback(true)
		} catch (err) {
			console.error("Permission denied or error:", err);
			callback(false)
			throw new Error("camera denied")
		}
	}

}

