Route.createToken = ({ }) => {
	return {
		token: ServerToken.create(),
	}
}

Route.updateToken = ({ body }) => {
	ServerToken.update(body.token)
}
