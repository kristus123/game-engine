
export function Update(u) {
	const object = {}

	object.update = () => u(object)

	return object
}

