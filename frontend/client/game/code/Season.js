export const Season = {
	normal: "normal",
	winter: "winter",
	summer: "summer",
	rain: "rain",

	makeWinterColorMap(sprite) {
		const map = {}
		for (const picture of sprite.getAllPicture()) {
			const ctx = picture.ctx
			const imgData = ctx.getImageData(0, 0, picture.canvas.width, picture.canvas.height)
			const data = imgData.data
			for (let i = 0; i < data.length; i += 4) {
				const r = data[i]
				const g = data[i+1]
				const b = data[i+2]
				const a = data[i+3]
				if (a > 0) {
					// Foliage green colors typically have g > r and g > b
					if (g > r && g > b && g > 40) {
						const brightness = (r + g + b) / 3
						let nr, ng, nb
						if (brightness > 120) {
							nr = 255
							ng = 255
							nb = 255
						}
						else if (brightness > 70) {
							nr = 220
							ng = 230
							nb = 245
						}
						else {
							nr = 160
							ng = 180
							nb = 205
						}
						map[`rgb(${r},${g},${b})`] = { r: nr, g: ng, b: nb }
					}
				}
			}
		}
		return map
	},

	drawGroundOverlay(season, groundArea) {
		if (season == Season.winter) {
			D1.color(groundArea, "rgba(180, 215, 255, 0.25)")
		}
		else if (season == Season.summer) {
			D1.color(groundArea, "rgba(255, 255, 170, 0.12)")
		}
	}
}
