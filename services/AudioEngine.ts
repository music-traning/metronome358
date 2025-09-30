export class AudioEngine {
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    constructor() {
        // Initialization is deferred until user interaction
    }

    public init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
        }
    }

    public isInitialized(): boolean {
        return !!this.audioContext;
    }

    public getContext(): AudioContext {
        if (!this.audioContext) {
            throw new Error("AudioEngine not initialized. Call init() first.");
        }
        return this.audioContext;
    }

    public setVolume(volume: number) {
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(volume, this.audioContext!.currentTime);
        }
    }

    public playClick(type: 'normal' | 'accent', time: number) {
        if (!this.audioContext || !this.masterGain) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.audioContext.currentTime;
        const attackTime = 0.001;
        const decayTime = 0.05;
        
        if (type === 'accent') {
            osc.frequency.setValueAtTime(1200, time);
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(1, time + attackTime);
            gain.gain.exponentialRampToValueAtTime(0.001, time + decayTime);
        } else {
            osc.frequency.setValueAtTime(880, time);
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.7, time + attackTime);
            gain.gain.exponentialRampToValueAtTime(0.001, time + decayTime);
        }

        osc.start(time);
        osc.stop(time + decayTime + 0.05);
    }
}
