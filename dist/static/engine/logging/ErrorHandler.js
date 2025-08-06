
export class ErrorHandler {

	static run(logic) {
		try {
			logic()
		}
		catch (error) {
			console.error(error)
		}
	}

}
