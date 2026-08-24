const guildId = "1277643963725250801"
const channelCache = new Map()
const channelMoveCache = new Map()

export class DiscordLogServer {
	static sendMessage(sessionId, message) {
		TaskQueue.global.add(async () => {
			try {
				const channelName = sessionId.replace(/[^a-z0-9-]/ig, "").toLowerCase()
				const id = await this.getChannelId(channelName)
				const content = message.length > 1990 ? message.substring(0, 1990) + "..." : message
				await DiscordHttpClient.post(`/channels/${id}/messages`, { content })

				await this.bumpChannel(channelName, id)
				await this.cleanupOldChannels()
			}
			catch (e) {
				console.error("Discord error:", e)
			}
		})
	}

	static async bumpChannel(name, id) {
		const now = Date.now()
		if (channelMoveCache.has(name) && now - channelMoveCache.get(name) < 60000) {
			return
		}

		channelMoveCache.set(name, now)
		try {
			// Using the direct channel patch but setting position to 1 (under #chat)
			await DiscordHttpClient.patch(`/channels/${id}`, { position: 1 })
		}
		catch (e) {
			console.error("Failed to bump channel:", e.message || e)
		}
	}

	static async cleanupOldChannels() {
		const channels = await DiscordHttpClient.get(`/guilds/${guildId}/channels`)
		if (channels.length <= 100) {
			return
		}

		channels.sort((a, b) => b.position - a.position)
		const toDelete = channels.slice(0, channels.length - 100)

		for (const c of toDelete) {
			if (c.name !== "general" && c.name !== "chat") {
				await DiscordHttpClient.delete(`/channels/${c.id}`)
				channelCache.delete(c.name)
			}
		}
	}

	static async getChannelId(name) {
		if (channelCache.has(name)) {
			return channelCache.get(name)
		}

		const channels = await DiscordHttpClient.get(`/guilds/${guildId}/channels`)
		for (const c of channels) {
			channelCache.set(c.name, c.id)
			if (c.name === name) {
				return c.id
			}
		}

		const newChannel = await DiscordHttpClient.post(`/guilds/${guildId}/channels`, { name, type: 0 })
		channelCache.set(name, newChannel.id)
		return newChannel.id
	}
}
