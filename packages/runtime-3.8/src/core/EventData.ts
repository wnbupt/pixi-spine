import type { IEventData } from '@pixi-spine-patch/base';

/**
 * @public
 */
export class EventData implements IEventData {
    name: string;
    intValue: number;
    floatValue: number;
    stringValue: string;
    audioPath: string;
    volume: number;
    balance: number;

    constructor(name: string) {
        this.name = name;
    }
}
