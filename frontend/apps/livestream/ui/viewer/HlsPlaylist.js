export class HlsPlaylist {
	constructor() {
		this.routeName = "public_folder/hls/output.m3u8"
		this.url = `${Config.httpUrl}/${this.routeName}`
	}

	async getEndUtc() {
		const response = await LowLevelHttpClient.get({
			routeName: this.routeName,
			formatBody: response => response.text(),
		})
		if (!response.ok) {
			return null
		}

		let currentUtc = null
		let currentDuration = null
		let playlistEndUtc = null
		for (const line of (await response.body).split(/\r?\n/)) {
			if (line.startsWith("#EXT-X-PROGRAM-DATE-TIME:")) {
				const dateTime = line.slice("#EXT-X-PROGRAM-DATE-TIME:".length)
				currentUtc = Date.parse(dateTime.replace(/([+-]\d{2})(\d{2})$/, "$1:$2"))
			}
			else if (line.startsWith("#EXTINF:")) {
				currentDuration = Number.parseFloat(line.slice("#EXTINF:".length))
			}
			else if (line && !line.startsWith("#") && currentDuration != null) {
				if (Number.isFinite(currentUtc) && Number.isFinite(currentDuration)) {
					playlistEndUtc = currentUtc + currentDuration * 1_000
					currentUtc = playlistEndUtc
				}
				currentDuration = null
			}
		}

		return playlistEndUtc
	}
}
