import { Secrets } from "#root/Secrets.js"

class DiscordHttpClient {
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


const guildId = "1277643963725250801"
const botId = "1277643648472842305"
const channelCache = new Map()
class DiscordGuild {

	static async createChannel(name) {
		return DiscordHttpClient.post(`/guilds/${guildId}/channels`, {
			name,
			type: 0
		})
	}

	static async getChannels() {
		return DiscordHttpClient.get(`/guilds/${guildId}/channels`)
	}

	static async getChannelId(name) {
		if (channelCache.has(name)) {
			return channelCache.get(name)
		}

		for (const channel of await this.getChannels()) {
			channelCache.set(channel.name, channel.id)

			if (channel.name == name) {
				return channel.id
			}
		}

		const channel = await this.createChannel(name)

		channelCache.set(name, channel.id)

		return channel.id
	}

	static async sendMessage(channel, content) {
		const id = await this.getChannelId(channel)

		return DiscordHttpClient.post(`/channels/${id}/messages`, {
			content: content.trim()
		})
	}

	static async getMessages(channel) {
		const id = await this.getChannelId(channel)
		const messages = []

		for (const message of await DiscordHttpClient.get(
			`/channels/${id}/messages?limit=10`
		)) {
			if (message.author.id != botId) {
				messages.push(message.content)
			}
		}

		return messages.reverse()
	}

	static async deleteChannel(name) {
		const id = await this.getChannelId(name)

		await DiscordHttpClient.delete(`/channels/${id}`)

		channelCache.delete(name)
	}

	static async deleteMessagesFromUsers(channel) {
		const id = await this.getChannelId(channel)

		for (const message of await DiscordHttpClient.get(
			`/channels/${id}/messages?limit=20`
		)) {
			if (message.author.id != botId) {
				await DiscordHttpClient.delete(
					`/channels/${id}/messages/${message.id}`
				)
			}
		}
	}

	static async sendPicture(channel, base64) {
		const id = await this.getChannelId(channel)

		await DiscordHttpClient.upload(
			`/channels/${id}/messages`,
			base64
		)
	}

	static async moveChannelToTop(name) {
		const id = await this.getChannelId(name)

		await DiscordHttpClient.patch(`/channels/${id}`, {
			position: 0
		})
	}

	static async createCategory(name) {
		const category = await DiscordHttpClient.post(
			`/guilds/${guildId}/channels`,
			{
				name,
				type: 4
			}
		)

		return category.id
	}

	static async moveChannelToCategory(channel, category) {
		const channelId = await this.getChannelId(channel)
		const categoryId = await this.createCategory(category)

		await DiscordHttpClient.patch(`/channels/${channelId}`, {
			parent_id: categoryId
		})
	}
}

await DiscordGuild.sendMessage(
	"general",
	"Hello!"
)
await DiscordGuild.sendMessage(
	"general",
	"Hello!"
)

await DiscordGuild.sendMessage(
	"general",
	"Hello!"
)

await DiscordGuild.sendMessage(
	"general",
	"Hello!"
)
