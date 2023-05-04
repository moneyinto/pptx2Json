
import JSZip from "jszip";
import Background from "./Background";
import { IRelationship, ISldMaster, ITheme, IXSlide } from "./types";
import { ISlideBackground } from "./types/slide";
import Shapes from "./Shapes";
import { IPPTElement } from "./types/element";
import { createRandomCode } from "./util";
import Lines from "./Lines";
import Pictures from "./Picture";
import GraphicFrame from "./GraphicFrame";
import X2JS from "x2js";

export default class Slide {
    private _slide: IXSlide;
    private _relationships: IRelationship[];
    private _theme: ITheme;
    private _index: string = "";
    private _zip: JSZip;
    private _x2js: X2JS;
    private _sldMaster: ISldMaster;
    constructor(slide: IXSlide, slideRel: { Relationships: { Relationship: IRelationship[] } }, theme: ITheme, index: string, zip: JSZip, x2js: X2JS, sldMaster: ISldMaster) {
        this._slide = slide;
        this._relationships = slideRel.Relationships.Relationship;
        this._theme = theme;
        this._index = index;
        this._zip = zip;
        this._x2js = x2js;
        this._sldMaster = sldMaster;
    }

    async getSlide() {
        let background: ISlideBackground | undefined = undefined;
        if (this._slide.cSld.bg) {
            const bg = new Background(this._slide.cSld.bg, this._theme, this._relationships);
            background = {
                type: bg.type
            };

            if (bg.type === "solid") {
                background.color = bg.color;
            }

            if (bg.type === "image") {
                const fileExt = bg.imageSrc.replace(/.+\./, "");
                const image = await this._zip.file(bg.imageSrc)!.async("base64");
                background.image = `data:image/${fileExt};base64,` + image;
                background.imageSize = !!bg.stretch ? "cover" : "repeat";
            }

            if (bg.type === "gradient") {
                background.gradientColor = bg.gradientColor;
                background.gradientType = bg.gradientType;
                background.gradientRotate = bg.gradientRotate;
            }
        }

        let elements: IPPTElement[] = [];
        // 形状
        if (this._slide.cSld.spTree.sp) {
            const sps = new Shapes(this._slide.cSld.spTree.sp, this._theme, this._sldMaster);

            elements = elements.concat(sps.shapes);
        }

        // 线条
        if (this._slide.cSld.spTree.cxnSp) {
            const cxnSps = new Lines(this._slide.cSld.spTree.cxnSp, this._theme);

            elements = elements.concat(cxnSps.lines);
        }

        // 图片 视频 音频
        if (this._slide.cSld.spTree.pic) {
            const pic = new Pictures(this._slide.cSld.spTree.pic, this._theme, this._relationships);

            const pictures = pic.pictures;

            for (const picture of pictures) {
                const fileExt = picture.src.replace(/.+\./, "");
                if (picture.type === "image") {
                    const image = await this._zip.file(picture.src)!.async("base64");
                    picture.src = `data:image/${fileExt};base64,` + image;
                } else {
                    if (picture.cover) {
                        const coverFileExt = picture.cover.replace(/.+\./, "");
                        const image = await this._zip.file(picture.cover)!.async("base64");
                        picture.cover = `data:image/${coverFileExt};base64,` + image;
                    }
                    const media = await this._zip.file(picture.src)!.async("base64");
                    picture.src = `data:${picture.type}/${fileExt};base64,` + media;
                }
            }

            elements = elements.concat(pictures);
        }

        // 图表
        if (this._slide.cSld.spTree.graphicFrame) {
            const graphicFrame = new GraphicFrame(this._slide.cSld.spTree.graphicFrame, this._relationships, this._zip, this._x2js);

            const frames = await graphicFrame.getGraphicFrames();
            elements = elements.concat(frames);
        }

        // 考虑元素层级关系。

        // index 保留 看看后面需不需要排序
        console.log(this._index, this._slide);
        return {
            id: createRandomCode(),
            elements,
            ...background ? { background } : {}
        };
    }
}