import { VertexAttachment } from './Attachment';
import { AttachmentType, Color, IClippingAttachment } from '@pixi-spine-patch/base';
import type { SlotData } from '../SlotData';

/**
 * @public
 */
export class ClippingAttachment extends VertexAttachment implements IClippingAttachment {
    type = AttachmentType.Clipping;
    endSlot: SlotData;

    // Nonessential.
    color = new Color(0.2275, 0.2275, 0.8078, 1); // ce3a3aff

    constructor(name: string) {
        super(name);
    }
}
