import SolidFill from "./SolidFill";
import Style from "./Style";
import { ICxnSp, ITheme } from "./types";
import { IPPTLineElement } from "./types/element";
import { EMU2PIX, createRandomCode } from "./util";

export default class Lines {
    private _cxnSps: ICxnSp[];
    private _theme: ITheme;
    constructor(cxnSp: ICxnSp | ICxnSp[], theme: ITheme) {
        this._theme = theme;

        const isArray = cxnSp instanceof Array;
        if (!isArray) {
            this._cxnSps = [cxnSp];
        } else {
            this._cxnSps = cxnSp;
        }
    }

    get lines() {
        const lines: IPPTLineElement[] = [];
        for (const cxnSp of this._cxnSps) {
            const style = new Style(cxnSp.style, this._theme);

            const line: IPPTLineElement = {
                id: createRandomCode(),
                left: EMU2PIX(cxnSp.spPr.xfrm.off._x),
                top: EMU2PIX(cxnSp.spPr.xfrm.off._y),
                start: [0, 0],
                end: [EMU2PIX(cxnSp.spPr.xfrm.ext._cx), EMU2PIX(cxnSp.spPr.xfrm.ext._cy)],
                type: "line",
                name: cxnSp.nvCxnSpPr.cNvPr._name,
                style: "solid",
                color: style.ln,
                startStyle: "",
                endStyle: "",
                borderWidth: 2,
                opacity: 0
            };

            if (cxnSp.spPr.ln) {
                const ln = cxnSp.spPr.ln;
                if (ln.solidFill) {
                    const solidFill = new SolidFill(ln.solidFill, this._theme);
                    line.color = solidFill.color;
                    line.opacity = +solidFill.alpha / 1000;
                };
                line.style = ln.prstDash?._val || "solid";
                line.borderWidth = EMU2PIX(ln._w || "12700");
                line.startStyle = ln.headEnd?._type || "";
                line.endStyle = ln.tailEnd?._type || "";
            }

            lines.push(line);
        }
        return lines;
    }
}