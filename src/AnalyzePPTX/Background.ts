import { IBg, IRelationship, ITheme } from "./types";
import SolidFill from "./SolidFill";
import BlipFill from "./BlipFill";
import GradFill from "./GradFill";

export default class Background {
    private _type: "solid" | "image" | "gradient" = "solid";
    private _solidFill: SolidFill | null = null;
    private _blipFill: BlipFill | null = null;
    private _gradFill: GradFill | null = null;
    private _relationships: IRelationship[];
    constructor(bg: IBg, theme: ITheme, relationships: IRelationship[]) {
        this._relationships = relationships;
        if (bg.bgPr.solidFill) {
            this._solidFill = new SolidFill(bg.bgPr.solidFill, theme);
            this._type = "solid";
        }

        if (bg.bgPr.blipFill) {
            this._blipFill = new BlipFill(bg.bgPr.blipFill, this._relationships);
            this._type = "image";
        }

        if (bg.bgPr.gradFill) {
            this._gradFill = new GradFill(bg.bgPr.gradFill, theme);
            this._type = "gradient";
        }
    }

    get type() {
        return this._type;
    }

    get color() {
        let color = this._solidFill.color;
        if (this._solidFill.alpha) {
            const alpha = +this._solidFill.alpha / 100000;
            color = (color + Math.floor(255 * alpha).toString(16)).toLocaleUpperCase();
        }
        
        return color || "";
    }

    get gradientColor() {
        return this._gradFill?.color.map(c => { return { offset: +c.pos / 100000, value: c.value }; });
    }

    get gradientType() {
        return this._gradFill.type;
    }

    get gradientRotate() {
        return this._gradFill.rotate;
    }

    get imageSrc() {
        return this._blipFill?.src.replace("..", "ppt") || "";
    }

    get stretch() {
        return this._blipFill?.stretch || "";
    }

    get tile() {
        return this._blipFill?.tile || "";
    }
}