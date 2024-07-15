import { Color, TransformMode } from '@pixi-spine-patch/base';

/**
 * @public
 */
export class BoneData {
    index: number;
    name: string;
    parent: BoneData;
    length: number;
    x = 0;
    y = 0;
    rotation = 0;
    scaleX = 1;
    scaleY = 1;
    shearX = 0;
    shearY = 0;
    transformMode = TransformMode.Normal;
    skinRequired = false;

    color = new Color();

    constructor(index: number, name: string, parent: BoneData) {
        if (index < 0) throw new Error('index must be >= 0.');
        if (name == null) throw new Error('name cannot be null.');
        this.index = index;
        this.name = name;
        this.parent = parent;
    }
}
