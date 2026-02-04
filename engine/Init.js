export function Init(connectedClass, objects) {
	AssertNotNull(connectedClass, 'remember to pass "this" as first argument when using Init')
	// AssertJsObject(objects, 'second param should be a vanilla js object')

	const localObjects = Objects()

	Object.entries(objects).forEach(([instanceField, thing]) => {

		connectedClass[instanceField] = thing
		localObjects.add(thing)
	})

	return localObjects
}
