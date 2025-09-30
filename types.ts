export type ClickState = 0 | 1 | 2; // 0: off, 1: normal, 2: accent

export interface Preset {
    name: string;
    pattern: ClickState[][];
    beatsPerMeasure: number[];
    numMeasures: number;
    isUserDefined?: boolean;
}
