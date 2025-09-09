import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export function Init(connectedClass, objects) {
	AssertNotNull(connectedClass, 'remember to pass "this" as first argument when using Init')
	// AssertJsObject(objects, 'second param should be a vanilla js object')

	const localObjects = new LocalObjects()

	Object.entries(objects).forEach(([instanceField, thing]) => {

		connectedClass[instanceField] = thing
		localObjects.add(thing)
	})

	return localObjects
}
