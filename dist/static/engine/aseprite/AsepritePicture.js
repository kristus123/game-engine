import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class AsepritePicture {
	constructor(img, json) {

				AssertNotNull(img, "argument img in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(json, "argument json in " + this.constructor.name + ".js should not be null")
			
		this.img = img; 
		this.json = json; 

	}
}
