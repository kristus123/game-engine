
export function Ref(connectedClass, fieldAndObjecty) { // rename this to Init andf the other to 'Inits' ?

	const instanceField = Object.keys(fieldAndObjecty)[0]
	const object = fieldAndObjecty[instanceField]

	connectedClass[instanceField] = object

	return object
}
