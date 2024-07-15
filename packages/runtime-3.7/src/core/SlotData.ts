import { Color } from '@pixi-spine-patch/base';

import type { ISlotData } from '@pixi-spine-patch/base';
import type { BLEND_MODES } from '@pixi/core';
import type { BoneData } from './BoneData';

/**
 * @public
 */
export class SlotData implements ISlotData {
    index: number;
    name: string;
    boneData: BoneData;
    color = new Color(1, 1, 1, 1);
    darkColor: Color;
    attachmentName: string;
    blendMode: BLEND_MODES;

    constructor(index: number, name: string, boneData: BoneData) {
        if (index < 0) throw new Error('index must be >= 0.');
        if (name == null) throw new Error('name cannot be null.');
        if (boneData == null) throw new Error('boneData cannot be null.');
        this.index = index;
        this.name = name;
        this.boneData = boneData;
    }
}
