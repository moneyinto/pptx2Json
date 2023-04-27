
import JSZip from "jszip";
import Background from "./Background";
import { IRelationship } from "./types";
import { ISlideBackground } from "./types/slide";

export default class Slide {
    private _slide: any;
    private _relationships: IRelationship[];
    private _theme: any;
    private _index: string = "";
    private _zip: JSZip;
    constructor(slide: any, slideRel: any, theme: any, index: string, zip: JSZip) {
        this._slide = slide;
        this._relationships = slideRel.Relationships.Relationship;
        this._theme = theme;
        this._index = index;
        this._zip = zip;
    }

    async getSlide() {
        let background: ISlideBackground | undefined = undefined;
        if (this._slide.sld.cSld.bg) {
            const bg = new Background(this._slide.sld.cSld.bg, this._theme, this._relationships);
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
        return {
            id: this._index,
            elements: [],
            background
        };
    }
}