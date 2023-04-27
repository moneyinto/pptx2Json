import { IBg, IRelationship } from "./types";
import SolidFill from "./SolidFill";
import BlipFill from "./BlipFill";

export default class Background {
    private _type: "solid" | "image" | "gradient" = "solid";
    private _solidFill: SolidFill | null = null;
    private _blipFill: BlipFill | null = null;
    private _relationships: IRelationship[];
    constructor(bg: IBg, theme: any, relationships: IRelationship[]) {
        this._relationships = relationships;
        if (bg.bgPr.solidFill) {
            this._solidFill = new SolidFill(bg.bgPr.solidFill, theme) 
            this._type = "solid";
        }

        if (bg.bgPr.blipFill) {
            this._blipFill = new BlipFill(bg.bgPr.blipFill, this._relationships);
            this._type = "image";
        }

        if (bg.bgPr.gradFill) {
            this._type = "gradient";
        }
    }

    get type() {
        return this._type;
    }

    get color() {
        return this._solidFill?.value || "";
    }

    get imageSrc() {
        return this._blipFill?.value.replace("..", "ppt") || "";
    }

    get stretch() {
        return this._blipFill?.stretch || "";
    }

    get tile() {
        return this._blipFill?.tile || "";
    }
}