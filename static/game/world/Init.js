export function Init(connectedClass, objects) {
	AssertNotNull(connectedClass, 'remember to pass "this" as first argument when using Init')

	const localObjects = new LocalObjects()

	Object.entries(objects).forEach(([instanceField, thing]) => {

		connectedClass[instanceField] = thing
		localObjects.add(thing)
	})

	return localObjects
}
