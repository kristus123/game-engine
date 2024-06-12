export class SineWave {
    static audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
    static play(frequency = 800,type = "sine",duration = 200) {
      const oscillator = SineWave.audioCtx.createOscillator();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, SineWave.audioCtx.currentTime);
      oscillator.connect(SineWave.audioCtx.destination);
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
      }, duration);
    }
    static   playBlastChickenDieSound() {
    const part1Duration = 100;
    const part2Duration = 200;
    const part3Duration = 100;
    
    // First part: A quick high-pitched blast
    this.play(1000, 'square', part1Duration);
    
    // Second part: A lower frequency drop
    setTimeout(() => {
      this.play(400, 'sine', part2Duration);
    }, part1Duration);
    
    // Third part: A short burst to finish off
    setTimeout(() => {
      this.play(200, 'sawtooth', part3Duration);
    }, part1Duration + part2Duration);
  }

  }