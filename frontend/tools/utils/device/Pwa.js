export class Pwa {

	static deferredPrompt = null

	static {
		window.addEventListener("beforeinstallprompt", e => {
			e.preventDefault()
			this.deferredPrompt = e
		})

		window.addEventListener("appinstalled", () => {
			this.deferredPrompt = null
		})
	}

	static async install() {
		if (this.deferredPrompt) {
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
