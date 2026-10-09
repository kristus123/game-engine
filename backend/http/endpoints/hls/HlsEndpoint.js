import fs from "fs"
import path from "path"
import { randomUUID } from "crypto"

Files.createFolder("public_folder/hls")
Files.deleteFilesInFolder("public_folder/hls")

function parseHlsSegments(playlistContent) {
	const segments = []
	let currentUtc = null
	let currentDuration = null

	for (const line of playlistContent.split(/\r?\n/)) {
		if (line.startsWith("#EXT-X-PROGRAM-DATE-TIME:")) {
			currentUtc = Date.parse(line.slice("#EXT-X-PROGRAM-DATE-TIME:".length))
		}
		else if (line.startsWith("#EXTINF:")) {
			currentDuration = Number.parseFloat(line.slice("#EXTINF:".length))
		}
		else if (line && !line.startsWith("#") && currentDuration != null) {
			if (!Number.isFinite(currentUtc) || !Number.isFinite(currentDuration)) {
				throw new Error("HLS playlist is missing valid program date-time metadata")
			}

			segments.push({
				path: path.resolve("public_folder/hls", line),
				startUtc: currentUtc,
				duration: currentDuration,
			})

			currentUtc += currentDuration * 1_000
			currentDuration = null
		}
	}

	return segments
}

function hasAvailableHlsSegment() {
	try {
		const playlistContent = fs.readFileSync("public_folder/hls/output.m3u8", "utf8")
		return parseHlsSegments(playlistContent).some(segment => fs.existsSync(segment.path))
	}
	catch {
		return false
	}
}

async function makeTwitchClip({ endUtc, durationSeconds = 30 } = {}) {
	const endTime = Date.parse(endUtc)
	durationSeconds = Number(durationSeconds)
	if (!Number.isFinite(endTime) || !Number.isFinite(durationSeconds) || durationSeconds < 1 || durationSeconds > 60) {
		throw new Error("A clip needs a valid endUtc and duration from 1 to 60 seconds")
	}

	const playlistPath = "public_folder/hls/output.m3u8"
	if (!fs.existsSync(playlistPath)) {
		throw new Error("The livestream HLS playlist is not available")
	}

	const hlsRoot = path.resolve("public_folder/hls")
	const segments = parseHlsSegments(fs.readFileSync(playlistPath, "utf8"))
	for (const segment of segments) {
		if (!segment.path.startsWith(hlsRoot + path.sep) || !fs.existsSync(segment.path)) {
			throw new Error("The HLS playlist references an unavailable segment")
		}
	}

	if (segments.length == 0) {
		throw new Error("The livestream has no HLS footage available yet")
	}

	const startTime = Math.max(endTime - durationSeconds * 1_000, segments[0].startUtc)
	durationSeconds = (endTime - startTime) / 1_000
	if (durationSeconds < 1) {
		throw new Error("Wait for at least one second of livestream footage before making a clip")
	}

	const selectedSegments = segments.filter(segment =>
		segment.startUtc < endTime && segment.startUtc + segment.duration * 1_000 > startTime
	)
	if (selectedSegments.length == 0 || startTime < selectedSegments[0].startUtc || endTime > segments.at(-1).startUtc + segments.at(-1).duration * 1_000) {
		throw new Error("The requested clip is outside the available live HLS window")
	}

	const clipId = randomUUID()
	const clipFolder = "public_folder/twitch_clips"
	fs.mkdirSync(clipFolder, { recursive: true })
	const clipPlaylist = path.join(clipFolder, `${clipId}.m3u8`)
	const clipPath = path.join(clipFolder, `${clipId}.mp4`)
	const targetDuration = Math.ceil(Math.max(...selectedSegments.map(segment => segment.duration)))
	const playlistLines = [
		"#EXTM3U",
		"#EXT-X-VERSION:3",
		`#EXT-X-TARGETDURATION:${targetDuration}`,
		"#EXT-X-PLAYLIST-TYPE:VOD",
	]

	for (const segment of selectedSegments) {
		const relativeSegmentPath = path.relative(path.dirname(clipPlaylist), segment.path).split(path.sep).join("/")
		playlistLines.push(
			`#EXT-X-PROGRAM-DATE-TIME:${new Date(segment.startUtc).toISOString()}`,
			`#EXTINF:${segment.duration.toFixed(3)},`,
			relativeSegmentPath,
		)
	}
	playlistLines.push("#EXT-X-ENDLIST")
	fs.writeFileSync(clipPlaylist, playlistLines.join("\n"))

	let clipReady = false
	try {
		const seekSeconds = (startTime - selectedSegments[0].startUtc) / 1_000
		await Ffmpeg.runClip([
			"-hide_banner",
			"-loglevel",
			"error",
			"-y",
			"-i",
			clipPlaylist,
			"-ss",
			String(seekSeconds),
			"-t",
			String(durationSeconds),
			"-map",
			"0:v:0",
			"-map",
			"0:a:0?",
			"-c:v",
			"libx264",
			"-preset",
			"veryfast",
			"-crf",
			"22",
			"-c:a",
			"aac",
			"-b:a",
			"128k",
			"-movflags",
			"+faststart",
			clipPath,
		])
		clipReady = true
	}
	finally {
		fs.rmSync(clipPlaylist, { force: true })
		if (!clipReady) {
			fs.rmSync(clipPath, { force: true })
		}
	}

	return { path: clipPath.replaceAll("\\", "/") }
}

UnsecureRoute.sendChunk = async ({ req }) => {
	for await (const chunk of req) {
		await Ffmpeg.write(chunk)
	}
}

UnsecureRoute.startStream = async ({ body }) => {
	await Ffmpeg.start(body.mimeType)
}

UnsecureRoute.stopStream = async () => {
	await Ffmpeg.stop()
	Files.deleteFilesInFolder("public_folder/hls")
}

UnsecureRoute.streamOnline = () => {
	return {
		online: A.value(Ffmpeg.p) && hasAvailableHlsSegment(),
	}
}

UnsecureRoute.makeTwitchClip = ({ body }) => {
	return makeTwitchClip(body)
}
