export function Tts(text) {
  if (!('speechSynthesis' in window)) {
    console.log('TTS not supported in this browser.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // you can change language if needed
  utterance.rate = 1;       // speed (0.5 to 2)
  utterance.pitch = 1;      // pitch (0 to 2)

  speechSynthesis.speak(utterance);
}
