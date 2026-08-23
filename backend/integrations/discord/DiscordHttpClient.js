import { Secrets } from "#root/Secrets.js"

export class DiscordHttpClient {
	static {
		this.headers = {
			Authorization: `Bot ${Secrets.discordToken}`,
			"Content-Type": "application/json"
		}
	}

	static url(endpoint) {
		return `https://discord.com/api/v10${endpoint}`
	}

	static async throttle(call) {
		const response = await call()

		const remaining = Number(response.headers.get("X-RateLimit-Remaining") ?? 1)
		const resetAfter = Number(response.headers.get("X-RateLimit-Reset-After") ?? 0)

		if (remaining == 0) {
			await new Promise(resolve =>
				setTimeout(resolve, (resetAfter + 0.5) * 1000)
			)
		}

		if (response.status === 429) {
			const text = await response.text()
			let retryAfter = 5 // fallback
			try {
				const json = JSON.parse(text)
				if (json.retry_after) retryAfter = json.retry_after
			} catch(e) {}
			await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
			return this.throttle(call)
		}

		if (!response.ok) {
			throw new Error(
				`${response.status} ${await response.text()}`
			)
		}

		return response
	}

	static async get(endpoint) {
		const response = await this.throttle(() =>
			fetch(this.url(endpoint), {
				headers: this.headers
			})
		)

		return response.json()
	}

	static async post(endpoint, body) {
		const response = await this.throttle(() =>
			fetch(this.url(endpoint), {
				method: "POST",
				headers: this.headers,
				body: JSON.stringify(body)
			})
		)

		return response.json()
	}

	static async patch(endpoint, body) {
		await this.throttle(() =>
			fetch(this.url(endpoint), {
				method: "PATCH",
				headers: this.headers,
				body: JSON.stringify(body)
			})
		)
	}

	static async put(endpoint, body) {
		await this.throttle(() =>
			fetch(this.url(endpoint), {
				method: "PUT",
				headers: this.headers,
				body: JSON.stringify(body)
			})
		)
	}

	static async delete(endpoint) {
		await this.throttle(() =>
			fetch(this.url(endpoint), {
				method: "DELETE",
				headers: this.headers
			})
		)
	}

	static async upload(endpoint, base64) {
		const form = new FormData()

		form.append(
			"file",
			new Blob([Buffer.from(base64, "base64")], {
				type: "image/png"
			}),
			"image.png"
		)

		await this.throttle(() =>
			fetch(this.url(endpoint), {
				method: "POST",
				headers: {
					Authorization: this.headers.Authorization
				},
				body: form
			})
		)
	}
}
