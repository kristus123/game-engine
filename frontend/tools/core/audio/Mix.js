export class Mix {

	static master = AudioTrack("master")
	static fx = AudioTrack("fx")
	static mic = AudioTrack("mic")
	static voices = AudioTrack("voices")

	static {
		Mix.fx
			.apply(Vst.reverb({ decay: 1.2 }))
			.routeTo(Mix.master)

		Mix.voices.routeTo(Mix.master)

		Mix.master.routeTo(SoundContext.destination)
	}
}
