export const DemoQuest = () => Quest([
	MessageTask({
		messageText: "Press <key>E</key> to light torch",
		startAction: () => { G.player.light.intensity = 0 },
		markDoneIf: () => Keyboard.e,
		onDone: () => {
			G.player.light.intensity = 0.8
			Mix.fx.play(Sound.click)
		}
	}),
	MessageTask({
		messageText: "Walk to Old Sami",
		markDoneIf: () => Distance.within(150, G.player.position, G.world.oldSami.position)
	})
], () => {
	console.log("Demo Completed!")
})
