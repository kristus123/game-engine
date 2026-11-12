import fs from "fs"

Files.createFolder("public_folder/hls")
Files.deleteFilesInFolder("public_folder/hls")

function hasAvailableHlsSegment() {
	try {
		const playlistContent = fs.readFileSync("public_folder/hls/output.m3u8", "utf8")
		return playlistContent.split(/\r?\n/).some(line => line && !line.startsWith("#") && fs.existsSync(`public_folder/hls/${line}`))
	}
	catch {
		return false
	}
}

// Complete uploads are committed in order; aborted requests never write partial media.
UnsecureRoute.sendChunk = async ({ req, params, userId }) => {
	const chunks = []
	let size = 0
	for await const chunk of req {
		size += chunk.length
		if size > 16 * 1024 * 1024 {
			throw new Error("Media upload is too large")
		}
		chunks.push(chunk)
	}
	return HlsBroadcast.run(() => HlsBroadcast.write({ ...params, userId }, Buffer.concat(chunks)))
}

UnsecureRoute.startStream = ({ body, userId }) => HlsBroadcast.run(() => HlsBroadcast.start({ ...body, userId }))
UnsecureRoute.stopStream = ({ body, userId }) => HlsBroadcast.run(() => HlsBroadcast.stop(body.revision, userId))
UnsecureRoute.streamOnline = () => {
	return HlsBroadcast.run(async () => {
		await HlsBroadcast.expire()
		const status = HlsBroadcast.status()
		status.online = status.online && hasAvailableHlsSegment()
		if status.state == "live" && !status.online {
			status.state = "starting"
		}
		return status
	})
}

// The server owns expiry, including when every browser has closed or lost power.
const broadcastTimer = setInterval(() => {
	HlsBroadcast.run(() => HlsBroadcast.expire()).catch(error => console.warn("Broadcast expiry failed", error))
}, 1_000)
broadcastTimer.unref()
