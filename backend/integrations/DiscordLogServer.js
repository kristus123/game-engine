const guildId = "1277643963725250801"
const channelCache = new Map()
const channelMoveCache = new Map()

const TaskQueue = TaskQueue()

export class DiscordLogServer {
	static sendMessage(sessionId, message) {
		TaskQueue.add(async () => {
			try {
				const id = await this.getChannelId(sessionId)
				const content = message.length > 1990 ? message.substring(0, 1990) + "..." : message
				await DiscordHttpClient.post(`/channels/${id}/messages`, { content })

				await this.cleanupOldChannels()
			}
			catch (e) {
				console.error("Discord error:", e)
			}
		})
	}

	static async cleanupOldChannels() {
		const channels = await DiscordHttpClient.get(`/guilds/${guildId}/channels`)
		if (channels.length > 10) {
			for (const c of channels) {
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
			if (c.name == name) {
				return c.id
			}
		}

		const newChannel = await DiscordHttpClient.post(`/guilds/${guildId}/channels`, { name, type: 0 })
		channelCache.set(name, newChannel.id)
		return newChannel.id
	}
}
