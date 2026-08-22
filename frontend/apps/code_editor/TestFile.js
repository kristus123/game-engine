export const TestFile = `
const users = ["bob", "alice", "john"]

function getUser(name) {
	for (let i = 0; i < users.length; i++) {
		if (users[i] == name) {
			return users[i]
		}
	}
	return null
}

function printUsers() {
	for (let i = 0; i < users.length; i++) {
		console.log("USER: " + users[i])
	}
}

function addUser(name) {
	if (name != null && name != "") {
		users.push(name)
	}
}

let user = getUser("bob")

if (user) {
	console.log("found " + user)
} else {
	console.log("not found")
}

addUser("karen")
printUsers()
`
