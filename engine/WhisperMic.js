import init, { Whisper } from "https://cdn.jsdelivr.net/npm/whisper.cpp-wasm@latest/dist/whisper_wasm.js";

class WhisperMic {
  static modelUrl = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/models/ggml-tiny.en.q5_1.bin";
  static audioChunks = [];
  static whisper = null;
  static context = null;
  static source = null;
  static processor = null;
  static modelLoading = null;

  static start() {
    if (!WhisperMic.modelLoading) {
      WhisperMic.modelLoading = fetch(WhisperMic.modelUrl)
        .then(r => r.arrayBuffer())
        .then(buf => init().then(() => new Whisper(buf)))
        .then(w => {
          WhisperMic.whisper = w;
        });
    }

    return WhisperMic.modelLoading.then(() => {
      WhisperMic.audioChunks.length = 0;
      return navigator.mediaDevices.getUserMedia({ audio: true });
    }).then(stream => {
      WhisperMic.context = new AudioContext();
      WhisperMic.source = WhisperMic.context.createMediaStreamSource(stream);
      WhisperMic.processor = WhisperMic.context.createScriptProcessor(4096, 1, 1);

      WhisperMic.source.connect(WhisperMic.processor);
      WhisperMic.processor.connect(WhisperMic.context.destination);

      WhisperMic.processor.onaudioprocess = e => {
        WhisperMic.audioChunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      return WhisperMic;
    });
  }

  static stop() {
    if (WhisperMic.processor) WhisperMic.processor.disconnect();
    if (WhisperMic.source) WhisperMic.source.disconnect();

    var samples = Float32Array.from(WhisperMic.audioChunks.flat());
    return WhisperMic.whisper.fullTranscribe(samples);
  }
}

// Example usage:

WhisperMic.start().then(() => {
  console.log("Recording...");
  setTimeout(() => {
    WhisperMic.stop().then(result => {
      console.log("Transcription:", result.text);
    });
  }, 5000);
});

