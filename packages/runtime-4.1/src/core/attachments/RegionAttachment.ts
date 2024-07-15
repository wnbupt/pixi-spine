import { Attachment } from './Attachment';
import { AttachmentType, NumberArrayLike, Color, TextureRegion, Utils, IHasTextureRegion, IRegionAttachment } from '@pixi-spine-patch/base';
import type { Sequence } from './Sequence';
import type { Slot } from '../Slot';

/**
 * @public
 */
export class RegionAttachment extends Attachment implements IRegionAttachment, IHasTextureRegion {
    type = AttachmentType.Region;

    /** The local x translation. */
    x = 0;

    /** The local y translation. */
    y = 0;

    /** The local scaleX. */
    scaleX = 1;

    /** The local scaleY. */
    scaleY = 1;

    /** The local rotation. */
    rotation = 0;

    /** The width of the region attachment in Spine. */
    width = 0;

    /** The height of the region attachment in Spine. */
    height = 0;

    /** The color to tint the region attachment. */
    color = new Color(1, 1, 1, 1);

    /** The name of the texture region for this attachment. */
    path: string;

    private rendererObject: any = null;
    region: TextureRegion | null = null;
    sequence: Sequence | null = null;

    /** For each of the 4 vertices, a pair of <code>x,y</code> values that is the local position of the vertex.
     *
     * See {@link #updateOffset()}. */
    offset = Utils.newFloatArray(8);

    uvs = Utils.newFloatArray(8);

    tempColor = new Color(1, 1, 1, 1);

    constructor(name: string, path: string) {
        super(name);
        this.path = path;
    }

    /** Calculates the {@link #offset} using the region settings. Must be called after changing region settings. */
    updateRegion(): void {
        if (!this.region) throw new Error('Region not set.');
        const region = this.region;
        const regionScaleX = (this.width / this.region.originalWidth) * this.scaleX;
        const regionScaleY = (this.height / this.region.originalHeight) * this.scaleY;
        const localX = (-this.width / 2) * this.scaleX + this.region.offsetX * regionScaleX;
        const localY = (-this.height / 2) * this.scaleY + this.region.offsetY * regionScaleY;
        const localX2 = localX + this.region.width * regionScaleX;
        const localY2 = localY + this.region.height * regionScaleY;
        const radians = (this.rotation * Math.PI) / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const x = this.x;
        const y = this.y;
        const localXCos = localX * cos + x;
        const localXSin = localX * sin;
        const localYCos = localY * cos + y;
        const localYSin = localY * sin;
        const localX2Cos = localX2 * cos + x;
        const localX2Sin = localX2 * sin;
        const localY2Cos = localY2 * cos + y;
        const localY2Sin = localY2 * sin;
        const offset = this.offset;

        offset[0] = localXCos - localYSin;
        offset[1] = localYCos + localXSin;
        offset[2] = localXCos - localY2Sin;
        offset[3] = localY2Cos + localXSin;
        offset[4] = localX2Cos - localY2Sin;
        offset[5] = localY2Cos + localX2Sin;
        offset[6] = localX2Cos - localYSin;
        offset[7] = localYCos + localX2Sin;

        const uvs = this.uvs;

        if (region.degrees == 90) {
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

    /** Transforms the attachment's four vertices to world coordinates. If the attachment has a {@link #sequence}, the region may
     * be changed.
     * <p>
     * See <a href="http://esotericsoftware.com/spine-runtime-skeletons#World-transforms">World transforms</a> in the Spine
     * Runtimes Guide.
     * @param worldVertices The output world vertices. Must have a length >= <code>offset</code> + 8.
     * @param offset The <code>worldVertices</code> index to begin writing values.
     * @param stride The number of <code>worldVertices</code> entries between the value pairs written. */
    computeWorldVertices(slot: Slot, worldVertices: NumberArrayLike, offset: number, stride: number) {
        if (this.sequence != null) this.sequence.apply(slot, this);

        const bone = slot.bone;
        const vertexOffset = this.offset;
        const mat = bone.matrix;
        const x = mat.tx;
        const y = mat.ty;
        const a = mat.a;
        const b = mat.c;
        const c = mat.b;
        const d = mat.d;
        let offsetX = 0;
        let offsetY = 0;

        offsetX = vertexOffset[0];
        offsetY = vertexOffset[1];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // br
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        offset += stride;

        offsetX = vertexOffset[2];
        offsetY = vertexOffset[3];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // bl
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        offset += stride;

        offsetX = vertexOffset[4];
        offsetY = vertexOffset[5];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // ul
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        offset += stride;

        offsetX = vertexOffset[6];
        offsetY = vertexOffset[7];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // ur
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
    }

    copy(): Attachment {
        const copy = new RegionAttachment(this.name, this.path);

        copy.region = this.region;
        copy.rendererObject = this.rendererObject;
        copy.x = this.x;
        copy.y = this.y;
        copy.scaleX = this.scaleX;
        copy.scaleY = this.scaleY;
        copy.rotation = this.rotation;
        copy.width = this.width;
        copy.height = this.height;
        Utils.arrayCopy(this.uvs, 0, copy.uvs, 0, 8);
        Utils.arrayCopy(this.offset, 0, copy.offset, 0, 8);
        copy.color.setFromColor(this.color);
        copy.sequence = this.sequence != null ? this.sequence.copy() : null;

        return copy;
    }

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
}
