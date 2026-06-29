export class Weather {
	constructor() {
		// Initialize Stars
		this.stars = Array.from({ length: 60 }, () => ({
			rx: Math.random(),
			ry: Math.random(),
			size: Math.random() * 2 + 1,
		}))

		// Initialize Snow particles
		this.snowParticles = Array.from({ length: 80 }, () => ({
			x: Math.random() * Screen.width,
			y: Math.random() * Screen.height,
			speed: Math.random() * 40 + 30,
			size: Math.random() * 3 + 1,
		}))

		// Initialize Rain particles
		this.rainParticles = Array.from({ length: 120 }, () => ({
			x: Math.random() * Screen.width,
			y: Math.random() * Screen.height,
			speed: Math.random() * 300 + 300,
			length: Math.random() * 12 + 8,
		}))

		// Initialize Clouds
		this.clouds = [
			{ x: 100, y: 35, speed: 25, scale: 0.8 },
			{ x: 350, y: 55, speed: 15, scale: 1.1 },
			{ x: -150, y: 45, speed: 20, scale: 0.9 },
		]
	}

	update(seasonIndex, skyOpacity) {
		if (seasonIndex == 0) {
			this.updateWinter()
		}
		else if (seasonIndex == 1) {
			this.updateSummer()
		}
		else if (seasonIndex == 2) {
			this.updateRain()
		}
		else if (seasonIndex == -1 && skyOpacity > 0) {
			// Night ambient light
			Palette.ambientColor = "rgba(16, 32, 79, 0.3)"
		}
	}

	updateWinter() {
		Palette.ambientColor = "rgba(200, 220, 255, 0.2)"

		D1.ctx.save()
		D1.ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
		this.snowParticles.forEach(p => {
			p.y += p.speed * DeltaTime.value
			if (p.y > Screen.height) {
				p.y = 0
				p.x = Math.random() * Screen.width
			}
			D1.ctx.fillRect(p.x, p.y, p.size, p.size)
		})
		D1.ctx.restore()
	}

	updateSummer() {
		Palette.ambientColor = "rgba(255, 240, 200, 0.15)"

		D1.ctx.save()
		D1.ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
		this.clouds.forEach(cloud => {
			cloud.x += cloud.speed * DeltaTime.value
			if (cloud.x > Screen.width + 120 * cloud.scale) {
				cloud.x = -120 * cloud.scale
				cloud.y = Math.random() * 60 + 20
			}
			this.drawCloud(cloud)
		})
		D1.ctx.restore()
	}

	drawCloud(cloud) {
		const x = cloud.x
		const y = cloud.y
		const r = 25 * cloud.scale

		D1.ctx.beginPath()
		D1.ctx.arc(x, y, r, 0, Math.PI * 2)
		D1.ctx.arc(x + 20 * cloud.scale, y - 8 * cloud.scale, r * 1.2, 0, Math.PI * 2)
		D1.ctx.arc(x + 40 * cloud.scale, y, r, 0, Math.PI * 2)
		D1.ctx.fill()
	}

	updateRain() {
		Palette.ambientColor = "rgba(50, 50, 60, 0.4)"

		D1.ctx.save()
		D1.ctx.strokeStyle = "rgba(174, 194, 224, 0.6)"
		D1.ctx.lineWidth = 1.5
		D1.ctx.beginPath()
		this.rainParticles.forEach(p => {
			p.y += p.speed * DeltaTime.value
			if (p.y > Screen.height) {
				p.y = 0
				p.x = Math.random() * Screen.width
			}
			D1.ctx.moveTo(p.x, p.y)
			D1.ctx.lineTo(p.x, p.y + p.length)
		})
		D1.ctx.stroke()
		D1.ctx.restore()
	}

	drawStars(skyArea, skyOpacity) {
		D3.ctx.fillStyle = "white"
		this.stars.forEach(star => {
			const sx = skyArea.x + star.rx * skyArea.width
			const sy = skyArea.y + star.ry * skyArea.height
			const twinkle = Math.sin(Date.now() * 0.002 + star.rx * 100) * 0.3 + 0.7
			D3.ctx.globalAlpha = skyOpacity * twinkle
			D3.ctx.fillRect(sx, sy, star.size, star.size)
		})
	}
}
