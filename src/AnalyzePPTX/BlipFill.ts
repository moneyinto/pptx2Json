import { IBlipFill, IRelationship } from "./types";

export default class BlipFill {
    private _blipFill: IBlipFill;
    private _relationships: IRelationship[];
    constructor(blipFill: IBlipFill, relationships: IRelationship[]) {
        this._blipFill = blipFill;
        this._relationships = relationships;
    }

    get src() {
        const embed = this._blipFill.blip["_r:embed"];
        const relationship = this._relationships.find(r => r._Id === embed);
        return relationship?._Target || "";
    }

    // 透明度
    get opacity() {
        return +(this._blipFill.blip.alphaModFix?._amt || 0) / 1000;
    }

    // 拉伸配置
    get stretch() {
        return this._blipFill.stretch;
    }

    // 平铺配置
    get tile() {
        return this._blipFill.tile;
    }
}