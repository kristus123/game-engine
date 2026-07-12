export class AudioStream {
	constructor() {
		this.destination = SoundContext.context.createMediaStreamDestination()
	}

	routeTo(track) {
		track.routeTo(this.destination)
	}

	get stream() {
		return this.destination.stream
	}
}