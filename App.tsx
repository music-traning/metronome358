import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Controls } from './components/Controls';
import { ClickGrid } from './components/ClickGrid';
import { Footer } from './components/Footer';
import { Countdown } from './components/Countdown';
import { useMetronome } from './hooks/useMetronome';
import { useRecorder } from './hooks/useRecorder';
import type { ClickState, Preset } from './types';
import { PRESETS, DEFAULT_EMPTY_PATTERN } from './constants';

const App: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [bpm, setBpm] = useState<number>(60);
    const [volume, setVolume] = useState<number>(0.75);
    const [numMeasures, setNumMeasures] = useState<number>(4);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState<number[]>(Array(8).fill(4));
    const [pattern, setPattern] = useState<ClickState[][]>(DEFAULT_EMPTY_PATTERN);
    const [isCountdownEnabled, setIsCountdownEnabled] = useState(true);
    const [userPresets, setUserPresets] = useState<Preset[]>([]);

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsMobile(isTouchDevice);
        
        try {
            const savedPresets = localStorage.getItem('userPresets');
            if (savedPresets) {
                setUserPresets(JSON.parse(savedPresets));
            }
        } catch (error) {
            console.error("Could not load user presets from localStorage", error);
        }
    }, []);

    const fullPresetList = useMemo(() => [...PRESETS, ...userPresets], [userPresets]);

    const handlePatternChange = (measure: number, beat: number) => {
        setPattern(prevPattern => {
            const newPattern = prevPattern.map(row => [...row]);
            const currentState = newPattern[measure][beat];
            newPattern[measure][beat] = ((currentState + 1) % 3) as ClickState;
            return newPattern;
        });
    };

    const handleBeatsChange = (measureIndex: number, newBeats: number) => {
        setBeatsPerMeasure(prev => {
            const newBeatsArray = [...prev];
            newBeatsArray[measureIndex] = newBeats;
            return newBeatsArray;
        });
    };

    const handleNumMeasuresChange = (newNumMeasures: number) => {
        const newPattern = [...pattern];
        const newBeats = [...beatsPerMeasure];
        
        if (newNumMeasures > numMeasures) {
            for (let i = numMeasures; i < newNumMeasures; i++) {
                newPattern[i] = Array(16).fill(0);
                newBeats[i] = 4;
            }
        }
        
        setNumMeasures(newNumMeasures);
        setPattern(newPattern);
        setBeatsPerMeasure(newBeats);
    };

    const loadPreset = (preset: Preset) => {
        setPattern(preset.pattern);
        setBeatsPerMeasure(preset.beatsPerMeasure);
        setNumMeasures(preset.numMeasures);
    };

    const saveUserPreset = (name: string) => {
        const newPreset: Preset = {
            name,
            pattern,
            beatsPerMeasure: beatsPerMeasure.slice(0, numMeasures),
            numMeasures,
            isUserDefined: true,
        };
        const updatedPresets = [...userPresets, newPreset];
        setUserPresets(updatedPresets);
        try {
            localStorage.setItem('userPresets', JSON.stringify(updatedPresets));
        } catch (error) {
            console.error("Could not save user presets to localStorage", error);
        }
    };
    
    const deleteUserPreset = (index: number) => {
        const updatedPresets = userPresets.filter((_, i) => i !== index);
        setUserPresets(updatedPresets);
        try {
            localStorage.setItem('userPresets', JSON.stringify(updatedPresets));
        } catch (error) {
            console.error("Could not delete user preset from localStorage", error);
        }
    };

    const { startRecording, stopRecording, isRecording, recordedAudioUrl } = useRecorder();

    const onPlay = useCallback(() => {
        if(isRecording) stopRecording();
    }, [isRecording, stopRecording]);

    const onRecord = useCallback(() => {
        startRecording();
    }, [startRecording]);

    const { isPlaying, currentBeat, currentMeasure, start, stop, countdown } = useMetronome({
        pattern,
        bpm,
        volume,
        numMeasures,
        beatsPerMeasure,
        onPlay,
        isRecording,
        onRecord,
        isCountdownEnabled
    });

    const handlePlayToggle = () => {
        if (isPlaying || countdown > 0) {
            stop();
            if (isRecording) {
                stopRecording();
            }
        } else {
            start();
        }
    };
    
    const handleRecordToggle = () => {
        if (isPlaying || countdown > 0) {
            stop();
            if (isRecording) {
                stopRecording();
            }
        } else {
            start(true); // Start with recording flag
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 p-4 md:p-6 lg:p-8">
            <main className="flex-grow flex flex-col md:flex-row gap-8">
                <header className="md:hidden text-center mb-4">
                    <h1 className="text-4xl font-bold tracking-tighter text-cyan-400">Click Metronome</h1>
                    <p className="text-gray-400 italic mt-1">Sculpt Your Rhythm, Perfect Your Timing.</p>
                </header>

                <Controls
                    bpm={bpm}
                    setBpm={setBpm}
                    volume={volume}
                    setVolume={setVolume}
                    numMeasures={numMeasures}
                    setNumMeasures={handleNumMeasuresChange}
                    isPlaying={isPlaying || countdown > 0}
                    isRecording={isRecording}
                    onPlayToggle={handlePlayToggle}
                    onRecordToggle={handleRecordToggle}
                    isMobile={isMobile}
                    recordedAudioUrl={recordedAudioUrl}
                    isCountdownEnabled={isCountdownEnabled}
                    setIsCountdownEnabled={setIsCountdownEnabled}
                    presets={fullPresetList}
                    loadPreset={loadPreset}
                    saveUserPreset={saveUserPreset}
                    deleteUserPreset={deleteUserPreset}
                />

                <div className="flex-grow flex flex-col items-center">
                    <header className="hidden md:block text-center mb-6">
                        <h1 className="text-5xl font-bold tracking-tighter text-cyan-400">Click Metronome</h1>
                        <p className="text-gray-400 italic mt-2">Sculpt Your Rhythm, Perfect Your Timing.</p>
                    </header>
                    <ClickGrid
                        pattern={pattern}
                        numMeasures={numMeasures}
                        beatsPerMeasure={beatsPerMeasure}
                        currentMeasure={currentMeasure}
                        currentBeat={currentBeat}
                        isPlaying={isPlaying}
                        onPatternChange={handlePatternChange}
                        onBeatsChange={handleBeatsChange}
                    />
                </div>
            </main>
            <Footer />
            {countdown > 0 && <Countdown count={countdown} />}
        </div>
    );
};

export default App;
