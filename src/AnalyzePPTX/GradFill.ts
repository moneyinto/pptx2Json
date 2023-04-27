import SolidFill from "./SolidFill";
import { IGradFill } from "./types";

export default class GradFill {
    private _gradFill: IGradFill;
    private _theme: any;
    constructor(gradFill: IGradFill, theme: any) {
        this._gradFill = gradFill;
        this._theme = theme;
    }

    get color() {
        return this._gradFill.gsLst.gs.map((c) => {
            const solidFill = new SolidFill(c, this._theme);
            const color = solidFill.color;
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
