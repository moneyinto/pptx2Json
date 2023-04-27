import { IBlipFill, IRelationship } from "./types";

export default class BlipFill {
    private _blipFill: IBlipFill;
    private _relationships: IRelationship[];
    constructor(blipFill: IBlipFill, relationships: IRelationship[]) {
        this._blipFill = blipFill;
        this._relationships = relationships;
    }

    get value() {
        const embed = this._blipFill.blip["_r:embed"];
        const relationship = this._relationships.find(r => r._Id === embed);
        return relationship?._Target || "";
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