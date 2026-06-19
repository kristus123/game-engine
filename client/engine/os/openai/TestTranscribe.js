import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

const model = await pipeline(
  "automatic-speech-recognition",
  "Xenova/whisper-tiny"
);

console.log("model loaded");

export async function TestTranscribe(audio, callback = () => {}) {
  const result = await model(audio);

  callback?.(result.text);

  return result.text;
}
