// ClientId(


export class World {
	constructor() {
		GridUi.show()
		console.log(Args.list("x", [1,2,3], `${1 + 1}`))
		console.log(Args.string("x", [1,2,3]))
		console.log(Args.number("x", [1,2,3], 6))
	}


	update() {
	}

	draw(draw) {}
}
