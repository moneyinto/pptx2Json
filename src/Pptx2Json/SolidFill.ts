import Color from "./Color";
import { ISolidFill } from "./types";

export default class SolidFill extends Color {
    constructor(solidFill: ISolidFill, theme: any) {
        super(solidFill, theme);
    }
}