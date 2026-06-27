export function Role(decoded) {
	if (AdminUserId(decoded.internal.userId)) {
		return "ADMIN_ROLE"
	}
	else {
		return "USER_ROLE"
	}
}
