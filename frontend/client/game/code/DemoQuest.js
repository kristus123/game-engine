export const DemoQuest = () => Quest([
	MessageTask({
		text: "Press <key>E</key> to light torch",
		markDoneIf: () => Keyboard.e,
		onStart: () => {
			G.player.light.intensity = 0
			Palette.ambientColor = "#000000"
			Shadow.opacity = 1.0
		},
		onDone: () => {
			G.player.light.intensity = 0.8
			Mix.fx.play(Mp3.click)
		},
	}),
	MessageTask({
		text: "Walk to Old Sami",
		markDoneIf: () => G.player.within(150, G.oldSami),
	})
], () => {
	Toast("Demo Completed!")
})
