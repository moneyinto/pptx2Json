import { ITheme } from "./types";

export default class Theme {
    private _theme: ITheme;
    constructor(themeXML: { theme: { themeElements: ITheme } }) {
        this._theme = themeXML.theme.themeElements;
    }

    get theme() {
        return this._theme;
    }
}
