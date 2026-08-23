const guildId = "1277643963725250801"
const channelCache = new Map()
const channelMoveCache = new Map()

export class DiscordGuild {
	static logToSession(sessionId, message) {
		Queue.global.add(async () => {
			try {
				const channelName = `session-${sessionId.replace(/[^a-z0-9]/ig, "").substring(0, 20).toLowerCase()}`
				const id = await this.getChannelId(channelName)
				
				const safeContent = message.length > 1990 ? message.substring(0, 1990) + "..." : message
				await DiscordHttpClient.post(`/channels/${id}/messages`, { content: safeContent })

				const now = Date.now()
				if (!channelMoveCache.has(channelName) || now - channelMoveCache.get(channelName) > 60000) {
					channelMoveCache.set(channelName, now)
					await DiscordHttpClient.patch(`/channels/${id}`, { position: 0 })
				}

				const channels = await DiscordHttpClient.get(`/guilds/${guildId}/channels`)
				const sessionChannels = channels.filter(c => c.name.startsWith("session-"))
				
				if (sessionChannels.length > 100) {
					sessionChannels.sort((a, b) => (BigInt(a.id) < BigInt(b.id) ? -1 : 1))
					for (const c of sessionChannels.slice(0, -100)) {
						await DiscordHttpClient.delete(`/channels/${c.id}`)
						channelCache.delete(c.name)
					}
				}
			} catch (e) {
				console.error("Discord queue error:", e)
			}
		})
	}

	static async getChannelId(name) {
		if (channelCache.has(name)) return channelCache.get(name)

		const channels = await DiscordHttpClient.get(`/guilds/${guildId}/channels`)
		for (const c of channels) {
			channelCache.set(c.name, c.id)
			if (c.name === name) return c.id
		}

		const newChannel = await DiscordHttpClient.post(`/guilds/${guildId}/channels`, { name, type: 0 })
		channelCache.set(name, newChannel.id)
		return newChannel.id
	}
}
