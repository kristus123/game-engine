export class Pwa {
	static deferredPrompt = null

	static init(onReady = () => {}) {
		window.addEventListener("beforeinstallprompt", (e) => {
			e.preventDefault()

			this.deferredPrompt = e
		})
	}

	static async install() {
		if (this.deferredPrompt) {
			this.deferredPrompt.prompt()
			const choiceResult = await this.deferredPrompt.userChoice
			console.log("User choice:", choiceResult.outcome)
			this.deferredPrompt = null
		}
		else {
			console.log("Install prompt not available")
		}
	}
}
