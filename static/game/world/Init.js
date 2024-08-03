export function Init(connectedClass, objects) {
	const localObjects = new LocalObjects()

	Object.entries(objects).forEach(([instanceField, thing]) => {

		connectedClass[instanceField] = thing
		localObjects.add(thing)
	})

	return localObjects
}
