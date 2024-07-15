import type { IEventData } from '@pixi-spine-patch/base';

/** Stores the setup pose values for an {@link Event}.
 *
 * See [Events](http://esotericsoftware.com/spine-events) in the Spine User Guide.
 * @public
 * */
export class EventData implements IEventData {
    name: string;
    intValue = 0;
    floatValue = 0;
    stringValue: string | null = null;
    audioPath: string | null = null;
    volume = 0;
    balance = 0;

    constructor(name: string) {
        this.name = name;
    }
}
