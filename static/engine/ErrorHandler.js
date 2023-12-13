export class ErrorHandler {

	static run(logic) {
		try {
			logic()
		}
		catch(error) {
			document.getElementById('stackMessage').innerHTML = error.stack
				.replaceAll(/\n/g, '<br>')
				.replaceAll('http://localhost:5000', '')
				.replaceAll('at ', '')

			document.getElementById('errorMessage').innerHTML = `
				${error.message}
				<br><br>
				<br>
			`
			document.getElementById('errorOverlay').style.display = 'flex'
		}
		
	}
	
}
