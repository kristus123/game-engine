export const IntroTasks = {
	LightTorch: (world) => Task("Light Torch", {
		start: (markDone) => {
			world.player.light.intensity = 0 // Ensure torch is off at start
			world.player.msg.set([H.p("Press <key>E</key> to light torch")])
			world.player.msg.show()
			return {
				update: () => {
					world.player.resetVelocity()
					if (Keyboard.e) {
						world.player.msg.hide()
						world.player.light.intensity = 0.8
						Mix.fx.play(Sound.click)
						markDone()
					}
				}
			}
		}
	}),

	WalkToVoice: (world) => Task("Walk to Voice", {
		start: (markDone) => {
			world.dialogue = Dialogue([
				{ position: world.oldSami, text: "Turn off that annoying light!", sleepEnd: 2000 }
			], () => {
				world.dialogue = null
			})
			world.player.msg.set([H.p("Walk towards the sound")])
			world.player.msg.show()
			return {
				update: () => {
					if (world.dialogue) {
						world.dialogue.update()
					}
					if (world.player.distance(world.oldSami) < 150) {
						world.player.msg.hide()
						markDone()
					}
				}
			}
		}
	}),

	TurnOffLight: (world) => Task("Turn off Light", {
		start: (markDone) => {
			world.player.msg.set([H.p("Press <key>E</key> to turn off light!")])
			world.player.msg.show()
			return {
				update: () => {
					world.player.resetVelocity()
					if (Keyboard.e) {
						world.player.msg.hide()
						world.player.light.intensity = 0
						Mix.fx.play(Sound.click)
						markDone()
					}
				}
			}
		}
	}),

	FadeInStars: (world) => Task("Fade in Stars", {
		start: (markDone) => {
			world.quest.skyOpacity = 0
			Shadow.opacity = 1.0
			return {
				update: () => {
					world.player.resetVelocity()
					if (world.quest.skyOpacity < 1) {
						world.quest.skyOpacity += 0.8 * DeltaTime.value
					}
					if (Shadow.opacity > 0.45) {
						Shadow.opacity -= 0.8 * DeltaTime.value
					}
					if (world.quest.skyOpacity >= 1 && Shadow.opacity <= 0.45) {
						world.quest.skyOpacity = 1
						Shadow.opacity = 0.45
						markDone()
					}
				}
			}
		}
	}),

	SamiTalkStars: (world) => Task("Sami Talk Stars", {
		start: (markDone) => {
			world.dialogue = Dialogue([
				{ position: world.oldSami, text: "Look at the sky! The stars are so clear tonight...", sleepEnd: 3000 }
			], () => {
				world.dialogue = null
				markDone()
			})
			return {
				update: () => {
					world.player.resetVelocity()
					if (world.dialogue) {
						world.dialogue.update()
					}
				}
			}
		}
	}),

	PanCameraUp: (world) => Task("Pan Camera Up", {
		start: (markDone) => {
			world.cameraTarget = WorldPosition(world.player.position.x, world.player.position.y - 250)
			return {
				update: () => {
					world.player.resetVelocity()
					if (Distance.within(15, Camera.position, world.cameraTarget)) {
						markDone()
					}
				}
			}
		}
	}),

	LookAtStars: (world) => Task("Look at the Stars", {
		start: (markDone) => {
			const timer = StopWatch().start()
			return {
				update: () => {
					world.player.resetVelocity()
					if (timer.time > 4000) {
						markDone()
					}
				}
			}
		}
	}),

	PanCameraDown: (world) => Task("Pan Camera Down", {
		start: (markDone) => {
			world.cameraTarget = world.player.position
			return {
				update: () => {
					world.player.resetVelocity()
					if (world.quest.skyOpacity > 0) {
						world.quest.skyOpacity -= 0.8 * DeltaTime.value
					}
					else {
						world.quest.skyOpacity = 0
					}

					Shadow.opacity = 0.45

					if (Distance.within(15, Camera.position, world.player.position) && world.quest.skyOpacity <= 0) {
						markDone()
					}
				}
			}
		}
	})
}
