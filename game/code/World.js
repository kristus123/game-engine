// ClientId(


export class World {
	constructor() {
		Dom.overlay([
			Flex.column([
				Html.p('hei'),
				Html.div('white', [Html.p('hei')]),
				Html.div('white', [Html.p('hei')]),
			]),
			Flex.row([
				Html.div('white', [Html.p('hei')]),
				Html.div('white', [Html.p('hei')]),
			]),
		])
	}


	update() {
	}

	draw(draw) {}
}
