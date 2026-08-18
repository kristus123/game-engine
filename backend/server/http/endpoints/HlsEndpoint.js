import { spawn } from "child_process"


const ffmpeg = spawn("ffmpeg", [
	"-i",
	"pipe:0",
	"-c:v",
	"libx264",
	"-c:a",
	"aac",
	"-f",
	"hls",
	"-hls_time",
	"2",
	"-hls_list_size",
	"5",
	"output.m3u8"
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
	ffmpeg.stdin.write(body)

	// req.on("end", () => {
	// 	ffmpeg.stdin.end();
	// });

}
