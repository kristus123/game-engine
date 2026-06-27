class RouteRegistry {
	// Object.create(null) ensures no prototype pollution/keys (like your original code)
	static all = Object.create(null)
}

export const Route = new Proxy(RouteRegistry, {
	// Handles assignment: Route.triggerNotification = ({ body }) => { ... }
	set(target, path, callback) {
		if (path in target.all) {
			throw new Error(`route "${path}" already exists`)
		}

		target.all[path] = callback
		return true // JavaScript requires a truthy value to confirm successful assignment
	},

	// Handles execution: Route.triggerNotification({ body: ... })
	get(target, path) {
		if (path in target.all) {
			// Return a wrapped function that preserves your original try/catch logging
			return (args) => {
				try {
					return target.all[path](args)
				}
				catch (e) {
					console.log("ERROR: " + path)
					console.log(e)
					throw e
				}
			}
		}
		else {
			throw new Error("not found")
		}
	}
})