// This Line Is Here Because Engine Only Puts Includes For Classes That Match The Filename.
// Please Remove This Import Statement After Test. :)
import { TestClass, TestMixin } from "../../../client/engine/Base.js"

export class World {
	constructor() {
		this.objects = Objects([
			this.player = Player(WorldPosition(0, 0)),
			Sprite.snow(D3, WorldPosition(0, 0), 4)
		])

		for (const p of WorldPosition(0, 0, 500, 500).randomPoints(100, 20, 20)) {
			G.stones.add(new Stone(p))
		}

		Controller.control(this.player)
		//Camera.follow(this.player)
		setInterval(() => {
		}, 200)
		this.player.pushTowards(Mouse.position, 100)

		const tc = new TestClass()
		tc.use(TestMixin)
		tc.testFunc()

	}

	update() {
		this.objects.update()
		G.stones.update()
		if (Mouse.down) {
		}
	}
}
