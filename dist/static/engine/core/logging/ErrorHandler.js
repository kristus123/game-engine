import { Html } from '/static/engine/graphics/ui/html/Html.js'; 

export class ErrorHandler {

	static run(logic) {
		try {
			logic()
		}
		catch (error) {
			console.error(error)

			const stackMessage = error.stack
				.replaceAll(/\n/g, '<br>')
				.replaceAll('http://localhost:5000', '')
				.replaceAll('at ', '')

			const errorMessage = `
				${error.message}
				<br><br>
				<br>
			`

			
			Html.appendBody(Html.div("error-overlay", [
				Html.div("error-message", errorMessage),
				Html.div("stack-message", stackMessage),
			]))
		}

	}

}
