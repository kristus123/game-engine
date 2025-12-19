import * as vad from "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/bundle.min.js";

class vad {
  static myvad;

  static init() {
    vad.MicVAD.new({
      onSpeechStart: () => {
        console.log("Speech start detected");
      },
      onSpeechEnd: (audio) => {
		  console.log('No to no to sex! yes to jesus no to sex!')
      },
      onnxWASMBasePath:
        "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
      baseAssetPath:
        "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",
    }).then((myvad) => {
      vad.myvad = myvad;
      vad.myvad.start();
    });
  }
}

vad.init();

