import { Attachment } from './Attachment';
import { AttachmentType, ArrayLike, Color, TextureRegion, Utils, IRegionAttachment } from '@pixi-spine-patch/base';

import type { Bone } from '../Bone';
import { Slot } from '../Slot';

/**
 * @public
 */
export class RegionAttachment extends Attachment implements IRegionAttachment {
    type = AttachmentType.Region;

    static OX1 = 0;
    static OY1 = 1;
    static OX2 = 2;
    static OY2 = 3;
    static OX3 = 4;
    static OY3 = 5;
    static OX4 = 6;
    static OY4 = 7;

    static X1 = 0;
    static Y1 = 1;
    static C1R = 2;
    static C1G = 3;
    static C1B = 4;
    static C1A = 5;
    static U1 = 6;
    static V1 = 7;

    static X2 = 8;
    static Y2 = 9;
    static C2R = 10;
    static C2G = 11;
    static C2B = 12;
    static C2A = 13;
    static U2 = 14;
    static V2 = 15;

    static X3 = 16;
    static Y3 = 17;
    static C3R = 18;
    static C3G = 19;
    static C3B = 20;
    static C3A = 21;
    static U3 = 22;
    static V3 = 23;

    static X4 = 24;
    static Y4 = 25;
    static C4R = 26;
    static C4G = 27;
    static C4B = 28;
    static C4A = 29;
    static U4 = 30;
    static V4 = 31;

    x = 0;
    y = 0;
    scaleX = 1;
    scaleY = 1;
    rotation = 0;
    width = 0;
    height = 0;
    color = new Color(1, 1, 1, 1);

    path: string;
    rendererObject: any;
    region: TextureRegion;

    offset = Utils.newFloatArray(8);
    uvs = Utils.newFloatArray(8);

    tempColor = new Color(1, 1, 1, 1);

    constructor(name: string) {
        super(name);
    }

    updateOffset(): void {
        const regionScaleX = (this.width / this.region.originalWidth) * this.scaleX;
        const regionScaleY = (this.height / this.region.originalHeight) * this.scaleY;
        const localX = (-this.width / 2) * this.scaleX + this.region.offsetX * regionScaleX;
        const localY = (-this.height / 2) * this.scaleY + this.region.offsetY * regionScaleY;
        const localX2 = localX + this.region.width * regionScaleX;
        const localY2 = localY + this.region.height * regionScaleY;
        const radians = (this.rotation * Math.PI) / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const localXCos = localX * cos + this.x;
        const localXSin = localX * sin;
        const localYCos = localY * cos + this.y;
        const localYSin = localY * sin;
        const localX2Cos = localX2 * cos + this.x;
        const localX2Sin = localX2 * sin;
        const localY2Cos = localY2 * cos + this.y;
        const localY2Sin = localY2 * sin;
        const offset = this.offset;

        offset[RegionAttachment.OX1] = localXCos - localYSin;
        offset[RegionAttachment.OY1] = localYCos + localXSin;
        offset[RegionAttachment.OX2] = localXCos - localY2Sin;
        offset[RegionAttachment.OY2] = localY2Cos + localXSin;
        offset[RegionAttachment.OX3] = localX2Cos - localY2Sin;
        offset[RegionAttachment.OY3] = localY2Cos + localX2Sin;
        offset[RegionAttachment.OX4] = localX2Cos - localYSin;
        offset[RegionAttachment.OY4] = localYCos + localX2Sin;
    }

    setRegion(region: TextureRegion): void {
        this.region = region;
        const uvs = this.uvs;

        if (region.rotate) {
            uvs[2] = region.u;
            uvs[3] = region.v2;
            uvs[4] = region.u;
            uvs[5] = region.v;
            uvs[6] = region.u2;
            uvs[7] = region.v;
            uvs[0] = region.u2;
            uvs[1] = region.v2;
        } else {
            uvs[0] = region.u;
            uvs[1] = region.v2;
            uvs[2] = region.u;
            uvs[3] = region.v;
            uvs[4] = region.u2;
            uvs[5] = region.v;
            uvs[6] = region.u2;
            uvs[7] = region.v2;
        }
    }

    computeWorldVertices(bone: Bone | Slot, worldVertices: ArrayLike<number>, offset: number, stride: number) {
        const vertexOffset = this.offset;
        const mat = bone instanceof Slot ? bone.bone.matrix : bone.matrix;
        const x = mat.tx;
        const y = mat.ty;
        const a = mat.a;
        const b = mat.c;
        const c = mat.b;
        const d = mat.d;
        let offsetX = 0;
        let offsetY = 0;

        offsetX = vertexOffset[RegionAttachment.OX1];
        offsetY = vertexOffset[RegionAttachment.OY1];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // br
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        offset += stride;

        offsetX = vertexOffset[RegionAttachment.OX2];
        offsetY = vertexOffset[RegionAttachment.OY2];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // bl
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        offset += stride;

        offsetX = vertexOffset[RegionAttachment.OX3];
        offsetY = vertexOffset[RegionAttachment.OY3];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // ul
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        offset += stride;

        offsetX = vertexOffset[RegionAttachment.OX4];
        offsetY = vertexOffset[RegionAttachment.OY4];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // ur
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
    }
}
