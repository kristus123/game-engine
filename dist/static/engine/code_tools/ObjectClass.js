
export function ObjectClass(params, methods) {
	const instance = {}

	// Define methods dynamically based on the provided methods
	Object.entries(methods).forEach(([methodName, method]) => {
		instance[methodName] = () => method(params)
	})

	// Prepare the draw method to be called later
	instance.draw = (draw, guiDraw) => {
		methods.draw(draw, guiDraw, params)
	}

	return instance
}

