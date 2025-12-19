import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.wasm.min.js";
import * as vad from "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/bundle.min.js";

export class vadd {
  static myvad;

  static init() {
	  console.log("initing")
    vad.MicVAD.new({
      onSpeechStart: () => {
        console.log("Speech start detected");
      },
      onSpeechEnd: (audio) => {
		  console.log("sex")
        // do something with `audio` (Float32Array of audio samples at sample rate 16000)...
      },
      onnxWASMBasePath:
        "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
      baseAssetPath:
        "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",
    }).then((myvad) => {
      vadd.myvad = myvad;
      vadd.myvad.start();
    });
  }
}
