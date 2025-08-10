import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class OnClickOnce {
	constructor(run, args) {

				AssertNotNull(run, "argument run in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(args, "argument args in " + this.constructor.name + ".js should not be null")
			
		this.run = run; 
		this.args = args; 

	}

	onClick(p) {
		this.run(p)
	}

	update() {
		this.args?.update()
	}

	draw(draw, guiDraw) {
		this.args?.draw(draw, guiDraw)
	}
}
