import SolidFill from "./SolidFill";
import { ISolidFill, IStyle, ITheme } from "./types";

export default class Style {
    private _style: IStyle;
    private _theme: ITheme;
    constructor(style: IStyle, theme: ITheme) {
        this._style = style;
        this._theme = theme;
    }

    get fill() {
        if (this._style.fillRef) {
            const solidFill = new SolidFill(this._style.fillRef as ISolidFill, this._theme);
            return solidFill.color;
        }
        return "";
    }
}