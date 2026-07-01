export const DemoQuest = () => Quest([
	Quest.msg(
		"Press <key>E</key> to light torch",
		() => { G.player.light.intensity = 0 },
		() => Keyboard.e,
		() => {
			G.player.light.intensity = 0.8
			Mix.fx.play(Sound.click)
		}
	),
	Quest.msg(
		"Walk to Old Sami",
		null,
		() => Distance.within(150, G.player.position, G.world.oldSami.position)
	)
], () => {
	console.log("Demo Completed!")
})
