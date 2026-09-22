export function Role(decoded) {
	if (UserId.admin(decoded.internal.userId)) {
		return "ROLE_ADMIN"
	}
	else if (UserId.user(decoded.internal.userId)) {
		return "ROLE_USER"
	}
	else {
		throw new Error("wtfffff is : " + decoded)
	}
}
