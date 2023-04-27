import { ISolidFill } from "./types";

export default class Color {
    public color = "";
    private _val = "";
    private _alpha = "";
    constructor(solidFill: ISolidFill, theme: any) {
        if (solidFill.schemeClr) {
            // 后面考虑处理lumMod lumOff
            this._val = solidFill.schemeClr._val;
            this._alpha = solidFill.schemeClr.alpha?._val;
            const srgbClr = theme.clrScheme[this._val].srgbClr;
            this.color = ("#" + srgbClr._val).toLocaleUpperCase();
        } else if (solidFill.srgbClr) {
            this._alpha = solidFill.srgbClr.alpha?._val;
            this.color = ("#" + solidFill.srgbClr._val).toLocaleUpperCase();
        }

        if (this._alpha) {
            const alpha = +this._alpha / 100000;
            this.color = (this.color + Math.floor(255 * alpha).toString(16)).toLocaleUpperCase();
        }
    }
}