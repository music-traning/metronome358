import React from 'react';
import type { ClickState } from '../types';
import { PlusIcon, MinusIcon } from './Icons';

interface ClickGridProps {
    pattern: ClickState[][];
    numMeasures: number;
    beatsPerMeasure: number[];
    currentMeasure: number | null;
    currentBeat: number | null;
    isPlaying: boolean;
    onPatternChange: (measure: number, beat: number) => void;
    onBeatsChange: (measureIndex: number, newBeats: number) => void;
}

const getButtonColor = (state: ClickState) => {
    switch (state) {
        case 1: return 'bg-cyan-600 hover:bg-cyan-500'; // Normal
        case 2: return 'bg-yellow-500 hover:bg-yellow-400'; // Accent
        default: return 'bg-gray-700 hover:bg-gray-600'; // Off
    }
};

export const ClickGrid: React.FC<ClickGridProps> = ({
    pattern, numMeasures, beatsPerMeasure, currentMeasure, currentBeat, isPlaying, onPatternChange, onBeatsChange
}) => {
    return (
        <div className="w-full max-w-4xl bg-gray-800/50 rounded-lg p-4 md:p-6 space-y-3">
            {Array.from({ length: numMeasures }).map((_, measureIndex) => (
                <div key={measureIndex} className="flex items-center gap-4">
                    <div className="w-8 text-center font-mono text-gray-400">{measureIndex + 1}</div>
                    <div className="flex-grow grid grid-cols-8 md:grid-cols-16 gap-1.5">
                        {Array.from({ length: beatsPerMeasure[measureIndex] }).map((_, beatIndex) => {
                             const isActive = isPlaying && currentMeasure === measureIndex && currentBeat === beatIndex;
                             const state = pattern[measureIndex][beatIndex];
                             const color = getButtonColor(state);
                             return (
                                 <button
                                     key={beatIndex}
                                     onClick={() => onPatternChange(measureIndex, beatIndex)}
                                     className={`w-full aspect-square rounded-md transition-all duration-100 transform ${color} ${isActive ? 'ring-2 ring-white scale-110' : ''} focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                                     aria-label={`Measure ${measureIndex + 1}, Beat ${beatIndex + 1}, State ${state}`}
                                 />
                             );
                        })}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-700 rounded-full">
                        <button onClick={() => onBeatsChange(measureIndex, Math.max(1, beatsPerMeasure[measureIndex] - 1))} className="p-1.5 text-gray-300 hover:text-white transition"><MinusIcon small={true} /></button>
                        <span className="w-6 text-center text-sm font-semibold">{beatsPerMeasure[measureIndex]}</span>
                        <button onClick={() => onBeatsChange(measureIndex, Math.min(16, beatsPerMeasure[measureIndex] + 1))} className="p-1.5 text-gray-300 hover:text-white transition"><PlusIcon small={true} /></button>
                    </div>
                </div>
            ))}
        </div>
    );
};
