export class Sky {
	static draw(season, skyOpacity, weather) {
		if (skyOpacity <= 0) return

		const skyArea = Camera.top(0.3)

		D3.ctx.save()
		D3.ctx.globalAlpha = skyOpacity

		// Draw sky - color changes with season
		let skyColor = "#040b26" // default night sky
		if (season == Season.winter) {
			skyColor = "#1a2a4a" // winter: icy dark blue
		}
		else if (season == Season.summer) {
			skyColor = "#4a90c2" // summer: warm light blue
		}
		else if (season == Season.rain) {
			skyColor = "#3d4550" // rain: overcast grey
		}
		D3.color(skyArea, skyColor)

		// Draw stars (with slight twinkling) - remove during Winter and Summer
		if (season == Season.normal || season == Season.rain) {
			weather.drawStars(skyArea, skyOpacity)
		}

		D3.ctx.restore()

		// Clear sky area on Palette.light so D3 sky is visible
		Palette.light.ctx.save()
		Palette.light.ctx.globalCompositeOperation = "destination-out"
		Palette.light.ctx.fillStyle = "rgba(0,0,0,1)"
		Palette.light.ctx.fillRect(skyArea.x, skyArea.y, skyArea.width, skyArea.height)
		Palette.light.ctx.restore()
	}
}
