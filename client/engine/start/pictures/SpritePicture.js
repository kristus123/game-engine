export class SpritePicture extends Picture {
	constructor(d, sprite, position, image) {
		super(position, image)
	}

	update() {
		const frame = this.sprite.asepriteJson.tags[this.sprite.activeTag][this.sprite.currentTagFrame]
		this.d.sprite(this.position, frame, this.canvas)
	}

}
