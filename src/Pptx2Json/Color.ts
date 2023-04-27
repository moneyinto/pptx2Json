import { ISchemeClr } from "./types";

export default class Color {
    public value = "";
    constructor(clr: ISchemeClr, theme: any) {
        const srgbClr = theme.clrScheme[clr._val].srgbClr;
        this.value = ("#" + srgbClr._val).toLocaleUpperCase();
        if (clr.alpha) {
            const alpha = +clr.alpha._val / 100000;
            this.value = ("#" + srgbClr._val + Math.floor(255 * alpha).toString(16)).toLocaleUpperCase();
        }
    }
}