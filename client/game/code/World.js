export class World {

	constructor() {
		Page.go(PracticePage)
		const e = Dom.add(H.p("Press <key>E</key>").floating())
		e.x = 100
		e.y = 100
	}

	update() {
	}

}
