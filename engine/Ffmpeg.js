import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import { pipeline } from "@xenova/transformers"

export class Ffmpeg {
	constructor() {
	}
}

const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
const recorder = new MediaRecorder(stream)
const chunks = []

recorder.ondataavailable = e => chunks.push(e.data)
recorder.start()

await new Promise(r => setTimeout(r, 5000))
recorder.stop()

await new Promise(r => recorder.onstop = r)

const videoBlob = new Blob(chunks, { type: "video/webm" })

const ffmpeg = new FFmpeg()
await ffmpeg.load()

await ffmpeg.writeFile("video.webm", await fetchFile(videoBlob))
await ffmpeg.exec(["-i", "video.webm", "audio.wav"])

const whisper = await pipeline(
  "automatic-speech-recognition",
  "Xenova/distil-whisper-small-int8"
)

const result = await whisper("audio.wav")

await ffmpeg.writeFile("subs.srt", new TextEncoder().encode(srtFromResult(result)))
await ffmpeg.exec(["-i", "video.webm", "-vf", "subtitles=subs.srt", "out.mp4"])

const out = await ffmpeg.readFile("out.mp4")

