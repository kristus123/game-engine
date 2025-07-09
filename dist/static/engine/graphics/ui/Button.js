import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Palette } from '/static/engine/core/Palette.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 

export class Button {
	constructor(position, text, onClick= (b) => {}) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(text, "argument text in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onClick, "argument onClick in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.text = text; 
		this.onClick = onClick; 

		this.button = Html.button(text, onClick)
		this.update()
	}

	update() {
		const offsetX = this.position.x - Camera.position.x + (Palette.width/2)
		const offsetY = this.position.y - Camera.position.y + (Palette.height/2)

		this.button.style.left = `${offsetX}px`
		this.button.style.top = `${offsetY}px`
	}

	draw(draw, guiDraw) {
	}
}
