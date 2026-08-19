import { spawn } from "child_process"

Files.deleteFilesInFolder("public_folder/hls")

const ffmpeg = spawn("ffmpeg", [
	"-i", "pipe:0",
	"-c:v", "libx264",
	"-preset", "ultrafast",
	"-c:a", "aac",
	"-f", "hls",
	"-hls_time", "5",
	"-hls_list_size", "3",
	"-hls_flags", "delete_segments",
	"public_folder/hls/output.m3u8"
])

ffmpeg.stderr.on("data", data => {
	console.log(data.toString())
})

ffmpeg.on("close", (code, signal) => {
	console.log("FFmpeg exited:", code, signal)
})

ffmpeg.on("error", error => {
	console.error("Failed to start FFmpeg:", error)
})

Route.sendChunk = ({ body }) => {
	console.log(Buffer.isBuffer(body), body.length)

	ffmpeg.stdin.write(body)

	// req.on("end", () => {
	// 	ffmpeg.stdin.end();
	// });

}
