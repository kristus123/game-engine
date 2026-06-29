export class WorldScene {
	static setup(world) {
		world.worldMap = Sprite.world(WorldPosition(0, 0))
		delete world.worldMap.layers.bush
		world.player = Player(WorldPosition(950, 420))
		G.player = world.player
		Controller.control(world.player)

		world.oldSami = OldSami()
		world.oldSami.position.x = 730
		world.oldSami.position.y = 600

		// Setup structures & interactables
		world.fireplace = Sprite.fireplace(WorldPosition(850, 580))
		world.fireplace.loopTag("idle")
		world.fireplace.collider = WorldPosition(world.fireplace.position.x + 60, world.fireplace.position.y + 60, 72, 72)

		world.bushes = [
			Sprite.bush(WorldPosition(500, 400)),
			Sprite.bush(WorldPosition(550, 800)),
			Sprite.bush(WorldPosition(1150, 750))
		]
		world.bushes.forEach(b => {
			b.loopTag("berries")
			b.collider = WorldPosition(b.position.x + 18, b.position.y + 18, 102, 72)
			b.slices = []
		})

		world.mapObstacles = [
			WorldPosition(1128, 234, 240, 258),
			WorldPosition(2046, 1350, 288, 246),
			WorldPosition(1506, 1626, 270, 282)
		]

		world.entities = Objects([
			world.worldMap,
			world.player,
			world.oldSami,
			world.fireplace,
			...world.bushes
		])

		Camera.position.x = 950
		Camera.position.y = 420
		world.cameraTarget = world.player.position
		Camera.follow(world.cameraTarget)
	}

	//commenting for now , we can use it later

	static resolveCollisions(world) {
		// Enforce collisions for static scene entities
		world.player.enforceCollision(world.fireplace.collider)
		world.player.enforceCollision(world.oldSami.sprite.collider)

		world.bushes.forEach(b => {
			world.player.enforceCollision(b.collider)
		})

		// Enforce collisions for background tents/structures
		world.mapObstacles.forEach(obstacle => {
			world.player.enforceCollision(obstacle)
		})
	}

	static clipToGrass(skyOpacity, groundArea) {
		if (skyOpacity > 0) {
			const clip = (ctx) => {
				ctx.beginPath()
				ctx.rect(groundArea.x, groundArea.y, groundArea.width, groundArea.height)
				ctx.clip()
			}
			clip(D1.ctx)
			clip(D2.ctx)
			clip(D3.ctx)
		}
	}
}
