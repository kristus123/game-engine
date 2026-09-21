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
}
