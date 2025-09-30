import React, { useState } from 'react';
import type { Preset } from '../types';
import { PlayIcon, StopIcon, RecordIcon, PlusIcon, MinusIcon, TrashIcon } from './Icons';

interface ControlsProps {
    bpm: number;
    setBpm: (bpm: number) => void;
    volume: number;
    setVolume: (volume: number) => void;
    numMeasures: number;
    setNumMeasures: (num: number) => void;
    isPlaying: boolean;
    isRecording: boolean;
    onPlayToggle: () => void;
    onRecordToggle: () => void;
    isMobile: boolean;
    recordedAudioUrl: string | null;
    isCountdownEnabled: boolean;
    setIsCountdownEnabled: (enabled: boolean) => void;
    presets: Preset[];
    loadPreset: (preset: Preset) => void;
    saveUserPreset: (name: string) => void;
    deleteUserPreset: (index: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
    bpm, setBpm, volume, setVolume, numMeasures, setNumMeasures, isPlaying, isRecording,
    onPlayToggle, onRecordToggle, isMobile, recordedAudioUrl, isCountdownEnabled, setIsCountdownEnabled,
    presets, loadPreset, saveUserPreset, deleteUserPreset
}) => {
    const [presetName, setPresetName] = useState('');

    const handleSavePreset = () => {
        if (presetName.trim()) {
            saveUserPreset(presetName.trim());
            setPresetName('');
        } else {
            alert('Please enter a name for the preset.');
        }
    };

    return (
        <div className="w-full md:w-80 lg:w-96 bg-gray-800/50 rounded-lg p-6 flex flex-col gap-6 self-start">
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={onPlayToggle}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-500 hover:bg-cyan-600'
                    } text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400`}
                    aria-label={isPlaying ? 'Stop' : 'Play'}
                >
                    {isPlaying ? <StopIcon /> : <PlayIcon />}
                </button>
                {!isMobile && (
                    <button
                        onClick={onRecordToggle}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-gray-600 hover:bg-gray-500'
                        } text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-400`}
                        aria-label={isRecording ? 'Stop Recording' : 'Record'}
                    >
                        <RecordIcon />
                    </button>
                )}
            </div>
            
            <div className="space-y-4">
                <label className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline">
                        <span className="font-medium">BPM</span>
                        <span className="text-2xl font-bold text-cyan-400">{bpm}</span>
                    </div>
                    <input
                        type="range"
                        min="30"
                        max="300"
                        value={bpm}
                        onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </label>
                <label className="flex flex-col gap-2">
                    <span className="font-medium">Volume</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </label>
            </div>

            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="font-medium">Measures</span>
                    <div className="flex items-center gap-2 bg-gray-700 rounded-full">
                         <button onClick={() => setNumMeasures(Math.max(1, numMeasures - 1))} className="p-2 text-gray-300 hover:text-white transition"><MinusIcon /></button>
                         <span className="w-8 text-center font-semibold">{numMeasures}</span>
                         <button onClick={() => setNumMeasures(Math.min(8, numMeasures + 1))} className="p-2 text-gray-300 hover:text-white transition"><PlusIcon /></button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="countdown-toggle" className="font-medium">Countdown</label>
                    <button
                        id="countdown-toggle"
                        onClick={() => setIsCountdownEnabled(!isCountdownEnabled)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${isCountdownEnabled ? 'bg-cyan-500' : 'bg-gray-600'}`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${isCountdownEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {!isMobile && recordedAudioUrl && (
                <div>
                    <h3 className="font-medium mb-2">Last Recording</h3>
                    <audio controls src={recordedAudioUrl} className="w-full"></audio>
                </div>
            )}
            
            <div className="space-y-3">
                <h3 className="font-medium">Presets</h3>
                <select 
                    onChange={(e) => loadPreset(presets[parseInt(e.target.value)])} 
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    {presets.map((preset, index) => (
                        <option key={`${preset.name}-${index}`} value={index}>{preset.name}</option>
                    ))}
                </select>
                
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            placeholder="New preset name..."
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button onClick={handleSavePreset} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition">Save</button>
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                        {presets.map((preset, index) => {
                           if (!preset.isUserDefined) return null;
                           const userPresetIndex = presets.slice(0, index).filter(p => p.isUserDefined).length;
                           return (
                             <div key={`${preset.name}-${index}`} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
                               <span className="truncate">{preset.name}</span>
                               <button onClick={() => deleteUserPreset(userPresetIndex)} className="text-gray-400 hover:text-red-500 transition ml-2">
                                 <TrashIcon />
                               </button>
                             </div>
                           );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
