Route.createToken = ({ body }) => {

	const token = ServerToken.create()
	console.log("hei")

	return {
		token: token,
	}
}
