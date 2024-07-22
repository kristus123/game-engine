export function Init(connectedClass, objects) {
	const localObjects = new LocalObjects()

	for (const object of objects) {
		const instanceField = Object.keys(object)[0]
		const thing = object[instanceField]

		connectedClass[instanceField] = thing
		localObjects.add(thing)
	}

	return localObjects
}
