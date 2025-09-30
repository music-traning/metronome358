import type { Preset, ClickState } from './types';

const EMPTY_8x16 = Array(8).fill(null).map(() => Array(16).fill(0)) as ClickState[][];
export const DEFAULT_EMPTY_PATTERN = JSON.parse(JSON.stringify(EMPTY_8x16));

export const PRESETS: Preset[] = [
    {
        name: 'Empty',
        numMeasures: 4,
        beatsPerMeasure: [4, 4, 4, 4],
        pattern: JSON.parse(JSON.stringify(EMPTY_8x16)),
    },
    {
        name: 'Full (4/4)',
        numMeasures: 4,
        beatsPerMeasure: [4, 4, 4, 4],
        pattern: (() => {
            const p = JSON.parse(JSON.stringify(EMPTY_8x16));
            for(let i=0; i<4; i++) {
                for(let j=0; j<4; j++) p[i][j] = 1;
                p[i][0] = 2;
            }
            return p;
        })(),
    },
    {
        name: '3/4 Waltz',
        numMeasures: 4,
        beatsPerMeasure: [3, 3, 3, 3],
        pattern: (() => {
            const p = JSON.parse(JSON.stringify(EMPTY_8x16));
            for(let i=0; i<4; i++) {
                p[i][0] = 2;
                p[i][1] = 1;
                p[i][2] = 1;
            }
            return p;
        })(),
    },
    {
        name: '5/4 Time',
        numMeasures: 4,
        beatsPerMeasure: [5, 5, 5, 5],
        pattern: (() => {
            const p = JSON.parse(JSON.stringify(EMPTY_8x16));
            for(let i=0; i<4; i++) {
                p[i][0] = 2;
                p[i][1] = 1;
                p[i][2] = 1;
                p[i][3] = 1;
                p[i][4] = 1;
            }
            return p;
        })(),
    },
    {
        name: 'Jazz Swing',
        numMeasures: 4,
        beatsPerMeasure: [4, 4, 4, 4],
        pattern: (() => {
            const p = JSON.parse(JSON.stringify(EMPTY_8x16));
            for(let i=0; i<4; i++) {
                p[i][1] = 1;
                p[i][3] = 1;
            }
            return p;
        })(),
    },
    {
        name: 'Son Clave (3-2)',
        numMeasures: 2,
        beatsPerMeasure: [8, 8],
        pattern: (() => {
            const p = JSON.parse(JSON.stringify(EMPTY_8x16));
            p[0] = [2,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0];
            p[1] = [0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0];
            return p;
        })(),
    },
    {
        name: 'Bossa Nova',
        numMeasures: 2,
        beatsPerMeasure: [8, 8],
        pattern: (() => {
            const p = JSON.parse(JSON.stringify(EMPTY_8x16));
            p[0] = [2,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0];
            p[1] = [0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0];
            return p;
        })(),
    },
    {
        name: 'Funk Groove 1',
        numMeasures: 1,
        beatsPerMeasure: [8],
        pattern: (() => {
            const p = JSON.parse(JSON.stringify(EMPTY_8x16));
            p[0] = [2,0,1,0,2,1,0,1,0,0,0,0,0,0,0,0];
            return p;
        })(),
    },
];
