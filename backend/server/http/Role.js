export function Role(decoded) {
	if (decoded == null) { // todo not use null
		// UNSECURE_ROLE is not the best name
		return "UNSECURE_ROLE" // mby find better names
	}
	else if (AdminUser(decoded.internal.userId)) {
		return "ADMIN_ROLE"
	}
	else {
		return "USER_ROLE"
	}
}
