export class Button extends DynamicGameObject {
	constructor(text, camera) { 
		super(new Position(0, 0, 265, 117), 100, 100)

		this.button = Html.button('hei', b => {
			this.button.innerText = 'xxx'
			Html.remove(b)
		})
	}

	update() {
		this.position.x += 1
		const offsetX = this.position.x - this.camera.position.x + (Palette.width/2)
		const offsetY = this.position.y - this.camera.position.y + (Palette.height/2)

		this.button.style.left = `${offsetX}px`
		this.button.style.top = `${offsetY}px`
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
	}
}
