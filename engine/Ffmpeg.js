import { FFmpeg } from "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/esm/index.js"
import { fetchFile } from "https://unpkg.com/@ffmpeg/util@0.12.1/dist/esm/index.js"
import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js"


export class Ffmpeg {
  constructor(durationMs) {
    this.durationMs = durationMs
    this.ffmpeg = new FFmpeg()
    this.chunks = []
  }

  start() {
    return navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      .then(stream => {
        this.recorder = new MediaRecorder(stream)
        this.recorder.ondataavailable = e => this.chunks.push(e.data)
        this.recorder.start()

        return new Promise(r => setTimeout(r, this.durationMs))
          .then(() => this.recorder.stop())
          .then(() => new Promise(r => this.recorder.onstop = r))
          .then(() => new Blob(this.chunks, { type: "video/webm" }))
      })
      .then(videoBlob => this.process(videoBlob))
  }

  process(videoBlob) {
    return this.ffmpeg.load()
      .then(() => this.ffmpeg.writeFile("video.webm", fetchFile(videoBlob)))
      .then(() => this.ffmpeg.exec(["-i", "video.webm", "audio.wav"]))
      .then(() => pipeline(
        "automatic-speech-recognition",
        "Xenova/distil-whisper-small-int8"
      ))
      .then(whisper => whisper("audio.wav"))
      .then(result => this.ffmpeg.writeFile(
        "subs.srt",
        new TextEncoder().encode(srtFromResult(result))
      ))
      .then(() => this.ffmpeg.exec([
        "-i", "video.webm",
        "-vf", "subtitles=subs.srt",
        "out.mp4"
      ]))
      .then(() => this.ffmpeg.readFile("out.mp4"))
  }
}
