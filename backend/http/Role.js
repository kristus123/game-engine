export function Role(decoded) {
	if (UserId.admin(decoded.internal.userId)) {
		return "ADMIN_ROLE"
	}
	else if (UserId.user(decoded.internal.userId)) {
		return "USER_ROLE"
	}
	else {
		throw new Error("x")
	}
}
