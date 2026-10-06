/**
 * Web Audio API real-time procedural synthesizer for Toxify.
 * Plays melodic lo-fi beats, synthwave chords, ambient pads, and 8-bit chiptunes.
 */

class ToxifyAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private step = 0;
  private currentGenre = 'lofi';
  private masterGain: GainNode | null = null;
  private volume = 0.7;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public start(genre: string = 'lofi') {
    this.initContext();
    this.currentGenre = genre;
    this.isPlaying = true;
    this.step = 0;

    if (this.timer) clearInterval(this.timer);
    // 120-130 BPM tempo
    const interval = genre === 'chiptune' ? 140 : genre === 'synthwave' ? 160 : 250;
    this.timer = window.setInterval(() => this.tick(), interval);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context safeguard
    }
  }

  private playKick() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  private playHiHat() {
    if (!this.ctx || !this.masterGain) return;
    try {
      // Noise burst for hi-hat
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(6000 + Math.random() * 2000, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  private tick() {
    this.step++;
    const s = this.step % 16;

    if (this.currentGenre === 'lofi') {
      // Lo-fi chord progression: Dm9 -> G13 -> Cmaj9 -> Am7
      const chords = [
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [196.00, 246.94, 293.66, 392.00], // G
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00]  // Am7
      ];
      const chordIdx = Math.floor(s / 4);
      const chord = chords[chordIdx];

      // Play soft electric piano tone
      if (s % 4 === 0) {
        chord.forEach(f => this.playTone(f, 'sine', 0.9, 0.07));
        this.playTone(chord[0] / 2, 'triangle', 0.8, 0.12); // Bass
        this.playKick();
      } else if (s % 2 === 0) {
        this.playHiHat();
        const randNote = chord[Math.floor(Math.random() * chord.length)] * 2;
        this.playTone(randNote, 'sine', 0.4, 0.04);
      }
    } else if (this.currentGenre === 'synthwave') {
      // Driving 80s bassline
      const bassNotes = [110, 110, 130.81, 146.83];
      const currentBass = bassNotes[Math.floor(s / 4)];
      this.playTone(currentBass, 'sawtooth', 0.15, 0.12);

      if (s % 4 === 0) this.playKick();
      if (s % 2 === 1) this.playHiHat();

      // Lead arpeggio
      const arp = [440, 523.25, 659.25, 783.99, 880];
      const leadNote = arp[s % arp.length];
      if (s % 2 === 0) {
        this.playTone(leadNote, 'square', 0.2, 0.03);
      }
    } else if (this.currentGenre === 'chiptune') {
      // 8-bit game melody
      const melody = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      const note = melody[(s * 3) % melody.length];
      this.playTone(note, 'square', 0.12, 0.05);

      if (s % 4 === 0) this.playKick();
      if (s % 2 === 0) this.playTone(130, 'triangle', 0.1, 0.08);
    } else {
      // Ambient focus pad
      const ambientFreqs = [174.61, 220.00, 261.63, 329.63, 392.00];
      if (s % 8 === 0) {
        ambientFreqs.forEach(f => this.playTone(f, 'sine', 2.0, 0.04));
      }
    }
  }
}

export const toxifySynth = new ToxifyAudioEngine();
