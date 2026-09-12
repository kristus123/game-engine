export class Pwa {

	static deferredPrompt = null

	static init() {

	}

	static {
		window.addEventListener("beforeinstallprompt", e => {
			e.preventDefault()
			this.deferredPrompt = e
			console.log("ready!")
		})

		window.addEventListener("appinstalled", () => {
			console.log("appinstalled")
			this.deferredPrompt = null
		})
	}

	static async install() {
		if (this.deferredPrompt) {
			console.log("rock yolo")
			this.deferredPrompt.prompt()
			const choiceResult = await this.deferredPrompt.userChoice
			console.log("User choice:", choiceResult.outcome)
			this.deferredPrompt = null
			return true
		}
		else {
			Toast("wait 5 seconds")
			console.log("Install prompt not available")
			return false
		}
	}
}
