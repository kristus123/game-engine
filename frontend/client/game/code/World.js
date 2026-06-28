export class World {
	constructor() {
		// Set ambient color to completely black initially
		Palette.ambientColor = "#000000"
		Shadow.opacity = 1.0

		this.berriesCollected = 0

		// World ground/floor sprite
		this.worldMap = Sprite.world(WorldPosition(0, 0))

		// Instantiate entities - positioned within world sprite bounds
		this.player = Player(WorldPosition(950, 420))
		G.player = this.player

		// Enable movement control for the player
		Controller.control(this.player)

		this.oldSami = OldSami()
		this.oldSami.position.x = 730
		this.oldSami.position.y = 600

		this.lavvu = Sprite.tree(WorldPosition(850, 300))
		this.lavvu.slices = [{
			name: "collider",
			pixelPosition: WorldPosition(7, 49, 26, 13)
		}]
		this.fireplace = Sprite.fireplace(WorldPosition(850, 580))
		this.fireplace.loopTag("idle")
		this.fireplace.collider = WorldPosition(
			this.fireplace.position.x + 60,
			this.fireplace.position.y + 60,
			72,
			72
		)

		// 3 berry bushes placed around
		this.bushes = [
			Sprite.bush(WorldPosition(500, 400)),
			Sprite.bush(WorldPosition(550, 800)),
			Sprite.bush(WorldPosition(1150, 750))
		]
		this.bushes.forEach(b => {
			b.loopTag("berries")
			b.collider = WorldPosition(
				b.position.x + 18,
				b.position.y + 18,
				102,
				72
			)
			b.slices = []
		})

		// Background Tents / Structures colliders
		this.mapObstacles = [
			WorldPosition(1128, 234, 240, 258),
			WorldPosition(2046, 1350, 288, 246),
			WorldPosition(1506, 1626, 270, 282)
		]

		this.entities = Objects([
			this.worldMap,
			this.player,
			this.oldSami,
			this.lavvu,
			this.fireplace,
			...this.bushes
		])

		// Camera setup
		Camera.follow(this.player.position)

		// Visual parameters
		this.skyOpacity = 0

		// Particle & background assets
		this.stars = Array.from({ length: 60 }, () => ({
			rx: Math.random(),
			ry: Math.random(),
			size: Math.random() * 2 + 1,
		}))

		this.snowParticles = Array.from({ length: 80 }, () => ({
			x: Math.random() * Screen.width,
			y: Math.random() * Screen.height,
			speed: Math.random() * 40 + 30,
			size: Math.random() * 3 + 1,
		}))

		this.rainParticles = Array.from({ length: 120 }, () => ({
			x: Math.random() * Screen.width,
			y: Math.random() * Screen.height,
			speed: Math.random() * 300 + 300,
			length: Math.random() * 12 + 8,
		}))

		this.clouds = [
			{ x: 100, y: 35, speed: 25, scale: 0.8 },
			{ x: 350, y: 55, speed: 15, scale: 1.1 },
			{ x: -150, y: 45, speed: 20, scale: 0.9 }
		]
		this.seasonIndex = -1 // -1 = normal sky, 0 = Winter, 1 = Summer, 2 = Rain
		this.isPlayerSitting = false

		// Simple quest list in top left corner (removed)
		this.questUI = null

		// Scripted quest flow
		this.quest = Quest([
			// Task 1: Light torch
			Task("Light Torch", {
				start: (markDone) => {
					this.player.light.intensity = 0 // Ensure torch is off at start
					this.player.msg.set([H.p("Press <key>E</key> to light torch")])
					this.player.msg.show()
					return {
						update: () => {
							this.player.resetVelocity()
							if (Keyboard.e) {
								this.player.msg.hide()
								this.player.light.intensity = 0.8
								Mix.fx.play(Sound.click)
								markDone()
							}
						}
					}
				}
			}),

			// Task 2: Walk to Voice
			Task("Walk to Voice", {
				start: (markDone) => {
					this.dialogue = Dialogue([
						{ position: this.oldSami, text: "Turn off that annoying light!", sleepEnd: 2000 }
					], () => {
						this.dialogue = null
					})
					this.player.msg.set([H.p("Walk towards the sound")])
					this.player.msg.show()
					return {
						update: () => {
							if (this.dialogue) {
								this.dialogue.update()
							}
							if (this.player.distance(this.oldSami) < 150) {
								this.player.msg.hide()
								markDone()
							}
						}
					}
				}
			}),

			// Task 3: Turn off Light
			Task("Turn off Light", {
				start: (markDone) => {
					this.player.msg.set([H.p("Press <key>E</key> to turn off light!")])
					this.player.msg.show()
					return {
						update: () => {
							this.player.resetVelocity()
							if (Keyboard.e) {
								this.player.msg.hide()
								this.player.light.intensity = 0
								Mix.fx.play(Sound.click)
								markDone()
							}
						}
					}
				}
			}),

			// Task 4: Look at the Stars
			Task("Look at the Stars", {
				start: (markDone) => {
					this.skyOpacity = 0
					Shadow.opacity = 1.0

					return {
						update: () => {
							this.player.resetVelocity()

							// 1. Sky fades in first
							if (this.skyOpacity < 1) {
								this.skyOpacity += 0.01
							}
							// 2. Rest of the world fades in second to night setting (0.45)
							else if (Shadow.opacity > 0.45) {
								Shadow.opacity -= 0.01
							}
							// 3. Once both are ready, transition
							else {
								markDone()
							}
						}
					}
				}
			}),

			// Task 5: Talk to Old Sami
			Task("Talk to Old Sami", {
				start: (markDone) => {
					this.dialogue = Dialogue([
						{ position: this.oldSami, text: "its about time i tell you the tale of our people", sleepEnd: 2500 },
						{ position: this.oldSami, text: "many people have heard of us", sleepEnd: 2500 },
						{ position: this.oldSami, text: "but they dont know much", sleepEnd: 2500 },
						{ position: this.oldSami, text: "it is extra important for us to carry on with traditions", sleepEnd: 3000 },
						{ position: this.oldSami, text: "we are the sami people", sleepEnd: 2500 }
					], () => {
						this.dialogue = null
						markDone()
					})

					return {
						update: () => {
							this.player.resetVelocity()
							if (this.dialogue) {
								this.dialogue.update()
							}
						}
					}
				}
			}),

			// Task 6: Find Berries
			Task("Find Berries", {
				start: (markDone) => {
					this.dialogue = Dialogue([
						{ position: this.oldSami, text: "Before we talk further, could you gather some cloudberries from the bushes?", sleepEnd: 3000 }
					], () => {
						this.dialogue = null
					})

					this.bushes.forEach(b => {
						b.harvested = false
						b.loopTag("berries")
					})

					return {
						update: () => {
							if (this.dialogue) {
								this.dialogue.update()
								this.player.resetVelocity()
								return
							}

							this.bushes.forEach(b => {
								if (!b.harvested && this.player.distance(b) < 80) {
									this.player.msg.set([H.p("Press <key>E</key> to pick berries")])
									this.player.msg.show()

									if (Keyboard.e) {
										b.harvested = true
										b.loopTag("idle")
										this.player.sprite.playTag("magic") // gather animation
										Mix.fx.play(Sound.click)
										this.berriesCollected++
										this.player.msg.hide()
									}
								}
							})

							let nearAnyBush = this.bushes.some(b => !b.harvested && this.player.distance(b) < 80)
							if (!nearAnyBush) {
								this.player.msg.hide()
							}

							if (this.berriesCollected >= 3) {
								if (this.player.distance(this.oldSami) < 100) {
									this.player.msg.hide()
									this.player.resetVelocity()

									this.dialogue = Dialogue([
										{ position: this.oldSami, text: "Ah, cloudberries! The gold of the Arctic. Thank you.", sleepEnd: 2500 },
										{ position: this.oldSami, text: "Now, let us go inside the lavvu to keep warm.", sleepEnd: 2500 }
									], () => {
										this.dialogue = null
										markDone()
									})
								}
							}
						}
					}
				}
			}),

			// Task 7: Go inside Lavvu
			Task("Go inside Lavvu", {
				start: (markDone) => {
					return {
						update: () => {
							// 1. Move old Sami towards the lavvu entrance at (1000, 370)
							const dx = 1000 - this.oldSami.position.x
							const dy = 370 - this.oldSami.position.y
							const dist = Math.hypot(dx, dy)
							if (dist > 5) {
								this.oldSami.position.x += (dx / dist) * 120 * DeltaTime.value
								this.oldSami.position.y += (dy / dist) * 120 * DeltaTime.value
							}
							else {
								this.oldSami.removeItself()
							}

							// 2. Prompt player when close to the entrance
							const playerDist = Math.hypot(this.player.position.x - 1000, this.player.position.y - 370)
							if (playerDist < 100) {
								this.player.msg.set([H.p("Press <key>E</key> to enter the lavvu")])
								this.player.msg.show()

								if (Keyboard.e) {
									this.player.msg.hide()

									// Ensure old Sami is removed if he hasn't reached yet
									this.oldSami.removeItself()
									this.player.removeItself()
									this.isPlayerSitting = true // lock control

									// Start Sami theme song
									Mix.master.volume = 0.6
									Mix.master.play(Sound.theme)

									markDone()
								}
							}
							else {
								this.player.msg.hide()
							}
						}
					}
				}
			}),

			// Task 8: Experience the Seasons
			Task("Experience the Seasons", {
				start: (markDone) => {
					this.seasonIndex = 0 // 0 = Winter, 1 = Summer, 2 = Rain
					this.seasonTimer = StopWatch().start()

					// Generate winter color maps and apply them!
					const treeMap = makeWinterColorMap(this.lavvu)
					this.lavvu.changeColor(treeMap)
					this.bushes.forEach(b => {
						const bushMap = makeWinterColorMap(b)
						b.changeColor(bushMap)
					})
					const worldMapColorMap = makeWinterColorMap(this.worldMap)
					this.worldMap.changeColor(worldMapColorMap)

					this.dialogue = Dialogue([
						{ position: this.oldSami, text: "Winter brings the deep snow, and the reindeer travel south...", sleepEnd: 3500 }
					], () => {
						this.dialogue = null
					})

					return {
						update: () => {
							this.player.resetVelocity()

							if (this.dialogue) {
								this.dialogue.update()
							}

							if (this.seasonTimer.time > 12000) {
								this.seasonIndex++
								this.seasonTimer.restart()

								if (this.seasonIndex == 1) {
									// Reset winter color changes to green summer
									this.lavvu.reset()
									this.bushes.forEach(b => b.reset())
									this.worldMap.reset()

									this.dialogue = Dialogue([
										{ position: this.oldSami, text: "Summer warms our land under the midnight sun...", sleepEnd: 3500 }
									], () => {
										this.dialogue = null
									})
								}
								else if (this.seasonIndex == 2) {
									this.dialogue = Dialogue([
										{ position: this.oldSami, text: "And the autumn rain tells us it is time to return to the fire.", sleepEnd: 3500 }
									], () => {
										this.dialogue = null
									})
								}
								else {
									markDone()
								}
							}
						}
					}
				}
			}),

			// Task 9: End Title
			Task("End Title", {
				start: (markDone) => {
					if (this.questUI) {
						Dom.remove(this.questUI)
						this.questUI = null
					}

					this.endUI = Dom.overlay(H.div("", [
						H.p("SAMI SPIRIT").css("font-size: 80px; font-weight: bold; margin-bottom: 20px; font-family: Courier New, monospace; color: white;"),
						H.p("* WORKING TITLE").css("font-size: 30px; font-family: Courier New, monospace; color: white;")
					]).css("display: flex; flex-direction: column; justify-content: center; align-items: center; background: black; color: white; z-index: 10000; width: 100vw; height: 100vh;"))

					return {
						update: () => {
							this.player.resetVelocity()
						}
					}
				}
			})
		], () => {
			console.log("Demo Completed!")
		})
	}

	update() {
		const groundArea = Camera.bottom(0.7)

		// Save context states
		D1.ctx.save()
		D2.ctx.save()
		D3.ctx.save()

		// Clip rendering to the grass layer (bottom half of the camera)
		const clipToGrass = (ctx) => {
			ctx.beginPath()
			ctx.rect(groundArea.x, groundArea.y, groundArea.width, groundArea.height)
			ctx.clip()
		}

		if (this.skyOpacity > 0) {
			clipToGrass(D1.ctx)
			clipToGrass(D2.ctx)
			clipToGrass(D3.ctx)
		}

		// Update all game entities
		this.entities.update()

		// Draw season-based ground color overlays
		if (this.seasonIndex == 0) {
			// Winter: Icy ground tint
			D1.ctx.fillStyle = "rgba(180, 215, 255, 0.25)"
			D1.ctx.fillRect(groundArea.x, groundArea.y, groundArea.width, groundArea.height)
		}
		else if (this.seasonIndex == 1) {
			// Summer: Bright sunny ground tint
			D1.ctx.fillStyle = "rgba(255, 255, 170, 0.12)"
			D1.ctx.fillRect(groundArea.x, groundArea.y, groundArea.width, groundArea.height)
		}

		// Restore context states
		D1.ctx.restore()
		D2.ctx.restore()
		D3.ctx.restore()

		// Keep player inside world bounds (6468 x 4548 pixels)
		const mapWidth = 6468
		const mapHeight = 4548
		const pc = this.player.collider

		if (this.isPlayerSitting) {
			this.player.resetVelocity()
		}

		if (pc.x < 0) {
			this.player.position.x -= pc.x
		}
		else if (pc.x + pc.width > mapWidth) {
			this.player.position.x -= (pc.x + pc.width - mapWidth)
		}

		if (pc.y < 0) {
			this.player.position.y -= pc.y
		}
		else if (pc.y + pc.height > mapHeight) {
			this.player.position.y -= (pc.y + pc.height - mapHeight)
		}

		// Enforce collisions for spawned entities
		Collision.applyCollisionBetween(this.lavvu.collider, this.player)
		Collision.applyCollisionBetween(this.fireplace.collider, this.player)
		Collision.applyCollisionBetween(this.oldSami.sprite.collider, this.player)

		this.bushes.forEach((b, idx) => {
			Collision.applyCollisionBetween(b.collider, this.player)
		})

		// Enforce collisions for background tents/structures
		this.mapObstacles.forEach(obstacle => {
			Collision.applyCollisionBetween(obstacle, this.player)
		})

		// Update quest script
		this.quest.update()

		// Background Sky & Ground Rendering on D3
		if (this.skyOpacity > 0) {
			const skyArea = Camera.top(0.3)

			D3.ctx.save()
			D3.ctx.globalAlpha = this.skyOpacity

			// Draw sky - color changes with season
			let skyColor = "#040b26" // default night sky
			if (this.seasonIndex == 0) {
				skyColor = "#1a2a4a" // winter: icy dark blue
			}
			else if (this.seasonIndex == 1) {
				skyColor = "#4a90c2" // summer: warm light blue
			}
			else if (this.seasonIndex == 2) {
				skyColor = "#3d4550" // rain: overcast grey
			}
			D3.color(skyArea, skyColor)

			// Draw stars (with slight twinkling) - remove during Winter (0) and Summer (1)
			if (this.seasonIndex == -1 || this.seasonIndex == 2) {
				D3.ctx.fillStyle = "white"
				this.stars.forEach(star => {
					const sx = skyArea.x + star.rx * skyArea.width
					const sy = skyArea.y + star.ry * skyArea.height
					const twinkle = Math.sin(Date.now() * 0.002 + star.rx * 100) * 0.3 + 0.7
					D3.ctx.globalAlpha = this.skyOpacity * twinkle
					D3.ctx.fillRect(sx, sy, star.size, star.size)
				})
			}

			D3.ctx.restore()

			// Clear sky area on Palette.light so D3 sky is visible
			Palette.light.ctx.save()
			Palette.light.ctx.globalCompositeOperation = "destination-out"
			Palette.light.ctx.fillStyle = "rgba(0,0,0,1)"
			Palette.light.ctx.fillRect(skyArea.x, skyArea.y, skyArea.width, skyArea.height)
			Palette.light.ctx.restore()
		}

		// Active dialogue bubble update if active
		if (this.dialogue) {
			this.dialogue.update()
		}

		// Weather transitions & ambient color adjustments
		if (this.seasonIndex == 0) {
			// Winter
			Palette.ambientColor = "rgba(200, 220, 255, 0.2)"

			D1.ctx.save()
			D1.ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
			this.snowParticles.forEach(p => {
				p.y += p.speed * DeltaTime.value
				if (p.y > Screen.height) {
					p.y = 0
					p.x = Math.random() * Screen.width
				}
				D1.ctx.fillRect(p.x, p.y, p.size, p.size)
			})
			D1.ctx.restore()
		}
		else if (this.seasonIndex == 1) {
			// Summer
			Palette.ambientColor = "rgba(255, 240, 200, 0.15)"

			D1.ctx.save()
			D1.ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
			this.clouds.forEach(cloud => {
				cloud.x += cloud.speed * DeltaTime.value
				if (cloud.x > Screen.width + 120 * cloud.scale) {
					cloud.x = -120 * cloud.scale
					cloud.y = Math.random() * 60 + 20
				}

				D1.ctx.beginPath()
				const cx = cloud.x
				const cy = cloud.y
				const r = 25 * cloud.scale
				D1.ctx.arc(cx, cy, r, 0, Math.PI * 2)
				D1.ctx.arc(cx + 20 * cloud.scale, cy - 8 * cloud.scale, r * 1.2, 0, Math.PI * 2)
				D1.ctx.arc(cx + 40 * cloud.scale, cy, r, 0, Math.PI * 2)
				D1.ctx.fill()
			})
			D1.ctx.restore()
		}
		else if (this.seasonIndex == 2) {
			// Rain
			Palette.ambientColor = "rgba(50, 50, 60, 0.4)"

			D1.ctx.save()
			D1.ctx.strokeStyle = "rgba(174, 194, 224, 0.6)"
			D1.ctx.lineWidth = 1.5
			D1.ctx.beginPath()
			this.rainParticles.forEach(p => {
				p.y += p.speed * DeltaTime.value
				if (p.y > Screen.height) {
					p.y = 0
					p.x = Math.random() * Screen.width
				}
				D1.ctx.moveTo(p.x, p.y)
				D1.ctx.lineTo(p.x, p.y + p.length)
			})
			D1.ctx.stroke()
			D1.ctx.restore()
		}
		else if (this.seasonIndex == -1 && this.skyOpacity > 0) {
			// Default faded-in ambient color (night time dark blue tint)
			Palette.ambientColor = "rgba(16, 32, 79, 0.3)"
		}

		// Update quest UI
		if (this.questUI) {
			let questHTML = "<div style=\"font-size: 18px; color: #8faec4; margin-bottom: 6px; border-bottom: 1px solid #3d5670; padding-bottom: 4px;\">JOURNAL</div>"
			this.quest.tasks.forEach(task => {
				if (task.done) {
					questHTML += `<div style="color: #6a8094; text-decoration: line-through; margin-bottom: 4px;">[x] ${task.name}</div>`
				}
				else if (task.active) {
					let name = task.name
					if (task.name == "Find Berries") {
						name = `Find Berries (${this.berriesCollected}/3)`
					}
					questHTML += `<div style="color: #ffd700; margin-bottom: 4px; text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);">[&gt;] ${name}</div>`
				}
				else {
					questHTML += `<div style="color: #a0b2c6; margin-bottom: 4px;">[ ] ${task.name}</div>`
				}
			})
			this.questUI.innerHTML = questHTML
		}
	}
}

function makeWinterColorMap(sprite) {
	const map = {}
	for (const picture of sprite.getAllPicture()) {
		const ctx = picture.ctx
		const imgData = ctx.getImageData(0, 0, picture.canvas.width, picture.canvas.height)
		const data = imgData.data
		for (let i = 0; i < data.length; i += 4) {
			const r = data[i]
			const g = data[i+1]
			const b = data[i+2]
			const a = data[i+3]
			if (a > 0) {
				// Foliage green colors typically have g > r and g > b
				if (g > r && g > b && g > 40) {
					const brightness = (r + g + b) / 3
					let nr, ng, nb
					if (brightness > 120) {
						nr = 255
						ng = 255
						nb = 255
					}
					else if (brightness > 70) {
						nr = 220
						ng = 230
						nb = 245
					}
					else {
						nr = 160
						ng = 180
						nb = 205
					}
					map[`rgb(${r},${g},${b})`] = { r: nr, g: ng, b: nb }
				}
			}
		}
	}
	return map
}
