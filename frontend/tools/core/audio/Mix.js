export class Mix {

	static master = Track("master")
	static fx = Track("fx")
	static mic = Track("mic")
	static voices = Track("voices")

	static {
		Mix.fx
			.apply(Vst.reverb({ decay: 1.2 }))
			.routeTo(Mix.master)

		Mix.voices.routeTo(Mix.master)
		Mix.master.routeTo(SoundContext.destination)
	}
}
