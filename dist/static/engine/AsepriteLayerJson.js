import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class AsepriteLayerJson {
	constructor(json) {

				AssertNotNull(json, "argument json in " + this.constructor.name + ".js should not be null")
			
		this.json = json; 

		console.log(json)
	}


}
