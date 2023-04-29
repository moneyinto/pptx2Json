import SolidFill from "./SolidFill";
import Style from "./Style";
import { ISp, ITheme } from "./types";
import { IPPTShapeElement } from "./types/element";
import { EMU2PIX, createRandomCode } from "./util";

export enum SHAPE_TYPE {
    rect = "rect",
    roundRect = "rectRadius",
    snip1Rect = "rectMinusSingleAngle",
    RECT_MINUS_SAME_SIDE_ANGLE = "rectMinusSameSideAngle",
    RECT_MINUS_OPPOSITE_ANGLE = "rectMinusOppositeAngle",
    RECT_SINGLE_RADIUS_MINUS_SINGLE_ANGLE = "rectSingleRadiusMinusSingleAngle",
    RECT_SINGLE_RADIUS = "rectSingleRadius",
    RECT_SAME_SIDE_RADIUS = "rectSameSideRadius",
    RECT_OPPOSITE_RADIUS = "rectOppositeRadius",
    OVAL = "oval",
    TRIANGLE = "triangle",
    RIGHT_TRIANGLE = "rightTriangle",
    PARALLELOGRAM = "parallelogram",
    TRAPEZOIDAL = "trapezoidal",
    DIAMOND = "diamond",
    PENTAGON = "pentagon",
    HEXAGON = "hexagon", // 六边形
    HEPTAGON = "heptagon", // 七边形
    OCTAGON = "octagon", // 八边形
    DECAGON = "decagon", // 十边形
    DODECAGON = "dodecagon", // 十二边形
    PIE_SHAPE = "pieShape", // 饼形
    CHORD_SHAPE = "chordShape", // 弦形
    TEARDROP_SHAPE = "teardropShape", // 泪珠形
    FRAME_SHAPE = "frameShape", // 框架
    HALF_CLOSED_FRAME_SHAPE = "halfClosedFrameShape", // 半闭框
    HORN = "horn", // 角
    TWILL = "twill", // 斜纹
    CROSS = "cross", // 十字形
    CUTAWAY_RECTANGLE = "cutawayRectangle", // 缺角矩形
    RING = "ring", // 环形
}

export default class Shapes {
    private _sps: ISp[] = [];
    private _theme: ITheme;
    constructor(sp: ISp | ISp[], theme: ITheme) {
        this._theme = theme;
        const isArray = sp instanceof Array;
        if (!isArray) {
            this._sps = [sp];
        } else {
            this._sps = sp;
        }
    }

    get shapes() {
        const shapes: IPPTShapeElement[] = [];
        for (const sp of this._sps) {
            console.log(sp);
            const shape: IPPTShapeElement = {
                id: createRandomCode(),
                fixedRatio: false,
                left: EMU2PIX(sp.spPr.xfrm.off._x),
                top: EMU2PIX(sp.spPr.xfrm.off._y),
                width: EMU2PIX(sp.spPr.xfrm.ext._cx),
                height: EMU2PIX(sp.spPr.xfrm.ext._cy),
                rotate: Math.floor(+(sp.spPr.xfrm._rot || "0") / 60000),
                type: "shape",
                name: sp.nvSpPr.cNvPr._name,
                shape: SHAPE_TYPE[sp.spPr.prstGeom._prst] || "rect"
            };

            const style = new Style(sp.style, this._theme);
            // 填充色
            if (!sp.spPr.noFill) {
                if (sp.spPr.solidFill) {
                    const solidFill = new SolidFill(sp.spPr.solidFill, this._theme);
                    const opacity = +solidFill.alpha / 1000;
                    shape.fill = {
                        color: solidFill.color,
                        opacity
                    }
                } else {
                    shape.fill = {
                        color: style.fill
                    }
                }
            }

            // 边框线
            if (sp.spPr.ln) {
                const ln = sp.spPr.ln;
                if (!ln.noFill && ln.solidFill) {
                    const solidFill = new SolidFill(ln.solidFill, this._theme);
                    const opacity = +solidFill.alpha / 1000;
                    const width = EMU2PIX(ln._w || "12700");
                    shape.outline = {
                        color: solidFill.color,
                        opacity,
                        width
                    }
                }
            } else {
                shape.outline = {
                    color: style.ln,
                    width: EMU2PIX("12700")
                }
            }

            shapes.push(shape);
        }
        return shapes;
    }
}