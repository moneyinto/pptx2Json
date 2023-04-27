export default class Theme {
    private _theme;
    constructor(themeXML: any) {
        this._theme = themeXML.theme.themeElements;
    }

    get theme() {
        return this._theme;
    }
}
