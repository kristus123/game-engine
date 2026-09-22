const adminUserIds = [

]

const userUserIds = [

]

export class UserId {
	static admin(userId) {
		return adminUserIds.includes(userId)
	}

	static user(userId) {
		return userUserIds.includes(userId)
	}

	static role(userId) {
		if (this.admin(userId)) {
			return "ROLE_ADMIN"
		}
		else if (this.user(userId)) {
			return "ROLE_USER"
		}
		else {
			return "ROLE_UNSECURE"
		}
	}

}
