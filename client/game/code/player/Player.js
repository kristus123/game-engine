export class Player extends Entity {
	constructor(position) {
		super(position)

		this.objects = Objects([
			this.sprite = Sprite.player(D1, this.position),
		])
	}

	update() {
		this.objects.update()

		for (const s of G.stones) {
			if (this.touches(s)) {
				Html.p('+1').dom().floating(this.position).animate('fade-away')
				s.removeItself()
			}

			s.position.moveTowards(this.position.center)
		}
	}
}
