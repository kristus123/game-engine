export class World {
	constructor() {
		Page.go(LandingPage)
	}

	update() {
		Sprite.player(D1, new WorldPosition(0,0)).update()
	}
}
