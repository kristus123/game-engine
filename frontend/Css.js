export class Css {

	static async use(path) {
		return new Promise((resolve, reject) => {
			const link = document.createElement("link")

			link.rel = "stylesheet"
			link.href = path

			link.onload = () => {
				console.log("css scucess")
				resolve()
			}
			link.onerror = () => {
				console.error("css error")
				reject()
			}

			document.head.appendChild(link)
		})
	}

}
