import Color from "./Color";
import { ISolidFill, ITheme } from "./types";

export default class SolidFill extends Color {
    constructor(solidFill: ISolidFill, theme: ITheme) {
        super(solidFill, theme);
    }
}