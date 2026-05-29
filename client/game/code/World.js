export class World {

	constructor() {
		Page.go(PracticePage)
		const e = Dom.add(H.p("Press <key>Ctrl+F</key> to ignite torch").floating())
		this.e = e
		e.x = 100
		e.y = 100
	}

	update() {
		this.e.worldFloat(WorldPosition(0, 0))
	}

}
