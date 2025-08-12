import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

/**
 * Handles adding monsters to the world and creating HTML control buttons.
 */
export class MakeWorldLively {

  constructor(services, objects) {

				AssertNotNull(services, "argument services in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(objects, "argument objects in " + this.constructor.name + ".js should not be null")
			
		this.services = services; 
		this.objects = objects; 

    this.services = services;
    this.objects = objects;
  }

  
}
