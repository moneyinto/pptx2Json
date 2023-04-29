import SolidFill from "./SolidFill";
import { IGradFill, ITheme } from "./types";

export default class GradFill {
    private _gradFill: IGradFill;
    private _theme: any;
    constructor(gradFill: IGradFill, theme: ITheme) {
        this._gradFill = gradFill;
        this._theme = theme;
    }

    get color() {
        return this._gradFill.gsLst.gs.map((c) => {
            const solidFill = new SolidFill(c, this._theme);
            let color = solidFill.color;
            if (solidFill.alpha) {
                const alpha = +solidFill.alpha / 100000;
                color = (color + Math.floor(255 * alpha).toString(16)).toLocaleUpperCase();
            }
            if (!color) {
                return {};
            }
            return { pos: c._pos, value: color };
        })
        .filter((c) => !!c.value);
    }

    get rotate() {
        if (this._gradFill.lin) {
            const rotate = +(this._gradFill.lin._ang || 0) / 60000 - 90;
            return rotate < 0 ? 360 + rotate : rotate;
        }
        return 0;
    }

    get type() {
        if (this._gradFill.lin) return "linear";
        if (this._gradFill.path) return "radial"
        return "linear";
    }
}
