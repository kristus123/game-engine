export class Mix {
	static master = Track("master")
	static fx = Track("fx")
	static mic = Track("mic")
	
	static destination = SoundContext.context.createMediaStreamDestination()
	static gainControl = SoundContext.context.createGain() // Volume Gain

	static {
		Mix.fx
			.apply(Vst.reverb({ decay: 1.2 }))
			.routeTo(Mix.master)

		Mix.master.routeTo(this.gainControl)
		this.gainControl.connect(SoundContext.destination)

		Mix.master.routeTo(this.destination)
	}

	static routeTo(audio) {
		audio.sourceStream = this.destination.stream
	}
}
