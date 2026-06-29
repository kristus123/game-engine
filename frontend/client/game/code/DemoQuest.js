export function DemoQuest(world) {
	return Quest([
		IntroTasks.LightTorch(world),
		IntroTasks.WalkToVoice(world),
		IntroTasks.TurnOffLight(world),
		IntroTasks.FadeInStars(world),
		IntroTasks.SamiTalkStars(world),
		IntroTasks.PanCameraUp(world),
		IntroTasks.LookAtStars(world),
		IntroTasks.PanCameraDown(world),

		GatheringTasks.TalkToOldSami(world),
		GatheringTasks.FindBerries(world),

		SeasonsTasks.GoInsideLavvu(world),
		SeasonsTasks.ExperienceSeasons(world),
		SeasonsTasks.EndTitle(world),
	], () => {
		console.log("Demo Completed!")
	})
}
