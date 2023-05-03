import { ISolidFill, ITheme } from "./types";
import { hsl } from "d3-color";

export default class Color {
    public color = "";
    private _val = "";
    public alpha = "100000";
    constructor(solidFill: ISolidFill, theme: ITheme) {
        if (solidFill.schemeClr) {
            // 后面考虑处理lumMod lumOff
            this._val = solidFill.schemeClr._val;
            this.alpha = solidFill.schemeClr.alpha?._val;
            const srgbClr = theme.clrScheme[this._val]?.srgbClr;
            if (srgbClr) {
                this.color = ("#" + srgbClr._val).toLocaleUpperCase();

                let _hsl = hsl(this.color);
                if (solidFill.schemeClr.lumMod || solidFill.schemeClr.lumOff) {
                    const lumMod = (+solidFill.schemeClr.lumMod?._val || 0) / 100000;
                    const lumOff = (+solidFill.schemeClr.lumOff?._val || 0) / 100000;
                    if (lumOff != 0) {
                        _hsl.l = (_hsl.l * (lumMod / 100) + (lumOff / 100)) * 100
                    }
                }
                
                if (solidFill.schemeClr.tint) {
                    const tint = +solidFill.schemeClr.tint._val / 1000;
                    const rgb = _hsl.rgb();
                    rgb.r = (rgb.r * tint) / 100 + 255 * (1 - tint / 100);
                    rgb.g = (rgb.g * tint) / 100 + 255 * (1 - tint / 100);
                    rgb.b = (rgb.b * tint) / 100 + 255 * (1 - tint / 100);
                    _hsl = hsl(rgb);
                }

                this.color = _hsl.hex().toLocaleUpperCase();
            }
        } else if (solidFill.srgbClr) {
            this.alpha = solidFill.srgbClr.alpha?._val;
            this.color = ("#" + solidFill.srgbClr._val).toLocaleUpperCase();
        } else if (solidFill.prstClr) {
            this.color = solidFill.prstClr._val;
        }
    }
}