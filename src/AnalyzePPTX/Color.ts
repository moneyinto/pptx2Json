import { ISolidFill, ITheme } from "./types";

export default class Color {
    public color = "";
    private _val = "";
    public alpha = "";
    constructor(solidFill: ISolidFill, theme: ITheme) {
        if (solidFill.schemeClr) {
            // 后面考虑处理lumMod lumOff
            this._val = solidFill.schemeClr._val;
            this.alpha = solidFill.schemeClr.alpha?._val;
            const srgbClr = theme.clrScheme[this._val].srgbClr;
            this.color = ("#" + srgbClr._val).toLocaleUpperCase();
        } else if (solidFill.srgbClr) {
            this.alpha = solidFill.srgbClr.alpha?._val;
            this.color = ("#" + solidFill.srgbClr._val).toLocaleUpperCase();
        }
    }
}