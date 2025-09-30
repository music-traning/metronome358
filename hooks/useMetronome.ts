import { useState, useEffect, useRef, useCallback } from 'react';
import type { ClickState } from '../types';
import { AudioEngine } from '../services/AudioEngine';

interface MetronomeProps {
    pattern: ClickState[][];
    bpm: number;
    volume: number;
    numMeasures: number;
    beatsPerMeasure: number[];
    isRecording: boolean;
    onPlay: () => void;
    onRecord: () => void;
    isCountdownEnabled: boolean;
}

export const useMetronome = ({
    pattern, bpm, volume, numMeasures, beatsPerMeasure, isRecording, onPlay, onRecord, isCountdownEnabled
}: MetronomeProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentMeasure, setCurrentMeasure] = useState<number | null>(null);
    const [currentBeat, setCurrentBeat] = useState<number | null>(null);
    const [countdown, setCountdown] = useState(0);

    const audioEngine = useRef<AudioEngine | null>(null);
    const timerRef = useRef<number | null>(null);
    const nextBeatTime = useRef<number>(0);
    const localCurrentMeasure = useRef<number>(0);
    const localCurrentBeat = useRef<number>(0);
    const scheduleAheadTime = 0.1; // seconds
    const lookahead = 25.0; // ms

    useEffect(() => {
        if (!audioEngine.current) {
            audioEngine.current = new AudioEngine();
        }
        audioEngine.current.setVolume(volume);
    }, [volume]);
    
    const scheduleNextBeat = useCallback(() => {
        const secondsPerBeat = 60.0 / bpm;
        const clickState = pattern[localCurrentMeasure.current][localCurrentBeat.current];

        if (clickState === 1) {
            audioEngine.current?.playClick('normal', nextBeatTime.current);
        } else if (clickState === 2) {
            audioEngine.current?.playClick('accent', nextBeatTime.current);
        }

        nextBeatTime.current += secondsPerBeat;

        localCurrentBeat.current++;
        if (localCurrentBeat.current >= beatsPerMeasure[localCurrentMeasure.current]) {
            localCurrentBeat.current = 0;
            localCurrentMeasure.current++;
            if (localCurrentMeasure.current >= numMeasures) {
                localCurrentMeasure.current = 0;
            }
        }
    }, [bpm, pattern, beatsPerMeasure, numMeasures]);

    const scheduler = useCallback(() => {
        while (audioEngine.current && nextBeatTime.current < audioEngine.current.getContext().currentTime + scheduleAheadTime) {
            setCurrentMeasure(localCurrentMeasure.current);
            setCurrentBeat(localCurrentBeat.current);
            scheduleNextBeat();
        }
        timerRef.current = window.setTimeout(scheduler, lookahead);
    }, [scheduleNextBeat]);

    const stop = useCallback(() => {
        setIsPlaying(false);
        setCurrentMeasure(null);
        setCurrentBeat(null);
        setCountdown(0);
        
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const start = useCallback((forRecording = false) => {
        const startPlayback = (startTime: number) => {
            if (!audioEngine.current?.isInitialized()) {
                audioEngine.current?.init();
            }
            audioEngine.current?.getContext().resume();
            
            localCurrentMeasure.current = 0;
            localCurrentBeat.current = 0;
            nextBeatTime.current = startTime;
            
            setIsPlaying(true);
            scheduler();
            
            if (forRecording) {
                onRecord();
            } else {
                onPlay();
            }
        };

        stop(); // Clear any previous timers and state before starting.

        if (isCountdownEnabled) {
            const countdownInterval = 60.0 / bpm;
            setCountdown(4);
            audioEngine.current?.init();
            const ac = audioEngine.current!.getContext();
            ac.resume();
            
            const countdownTime = ac.currentTime + 0.1;
            const metronomeStartTime = countdownTime + 4 * countdownInterval;
            
            for (let i = 0; i < 4; i++) {
                audioEngine.current?.playClick('accent', countdownTime + i * countdownInterval);
            }
            
            let count = 4;
            const interval = setInterval(() => {
                count--;
                if(count > 0) {
                    setCountdown(count);
                } else {
                    clearInterval(interval);
                    if (timerRef.current === interval) {
                        timerRef.current = null;
                    }
                    setCountdown(0);
                    // The JS timer is not perfectly accurate, but by passing the pre-calculated
                    // metronomeStartTime, the audio scheduler can compensate and start seamlessly.
                    startPlayback(metronomeStartTime);
                }
            }, countdownInterval * 1000);
            timerRef.current = interval;
        } else {
            audioEngine.current?.init();
            startPlayback(audioEngine.current!.getContext().currentTime);
        }
    }, [isCountdownEnabled, bpm, onPlay, onRecord, scheduler, stop]);
    
    useEffect(() => {
        // Stop playback if relevant props change while playing
        if (isPlaying) {
           stop();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bpm, pattern, numMeasures, beatsPerMeasure]);


    return { isPlaying, currentMeasure, currentBeat, start, stop, countdown };
};