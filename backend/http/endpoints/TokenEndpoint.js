Route.createToken = ({ body }) => {

	const token = ServerToken.create()

	return {
		token: token,
	}
}