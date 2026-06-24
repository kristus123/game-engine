export class Platform {

	static get ios() {
		if (typeof window == "undefined" || !window.navigator) {
			return false
		}
		const ua = window.navigator.userAgent || ""
		const platform = window.navigator.platform || ""
		return /iPad|iPhone|iPod/.test(ua) || (platform == "MacIntel" && window.navigator.maxTouchPoints > 1)
	}

	static get android() {
		if (typeof window == "undefined" || !window.navigator) {
			return false
		}
		const ua = window.navigator.userAgent || ""
		return /Android/i.test(ua)
	}

	static get phone() {
		if (typeof window == "undefined" || !window.navigator) {
			return false
		}
		const ua = window.navigator.userAgent || ""
		return this.ios || this.android || /Mobi|iPhone|iPod|iPad|Android|BlackBerry|IEMobile/i.test(ua)
	}

	static get tv() {
		if (typeof window == "undefined" || !window.navigator) {
			return false
		}
		const ua = window.navigator.userAgent || ""
		return /SmartTV|GoogleTV|AppleTV|HbbTV|CastNL|NetCast|Chromecast|Roku|AmazonWebServices|Opera TV|Viera/i.test(ua)
	}

	static get pwa() {
		if (typeof window == "undefined") {
			return false
		}
		return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone == true
	}

	static get pc() {
		return !this.phone && !this.tv
	}

	static get browser() {
		if (typeof window == "undefined") {
			return false
		}
		return !this.pwa && !window.Capacitor && !window.cordova
	}

}
