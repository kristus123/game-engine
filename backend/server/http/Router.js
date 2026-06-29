export function Router(role, path) { // todo rename to Route.js
	if (AdminRoute[path]) {
		Assert.admin(role)
		return AdminRoute[path]
	}
	else if (UserRoute[path]) {
		Assert.user(role)
		return UserRoute[path]
	}
	else if (UnsecureRoute[path]) {
		return UnsecureRoute[path]
	}
	else if (Route[path]) {
		// todo delete Route.js
		console.log("deprated route type. use dedicated role-based thingy bro")
		return Route[path]
	}
	else {
		throw new Error("unsupported route thingy")
	}
}

// To do we should also make sure that one route can only be assigned to one you know,
// like yeah, you can't assign two routes to two different permission routes,
// if you know what I'm saying, bro.
