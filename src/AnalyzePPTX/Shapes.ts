import Color from "./Color";
import GradFill from "./GradFill";
import SolidFill from "./SolidFill";
import Style from "./Style";
import { ISp, ITheme } from "./types";
import { IPPTShapeElement } from "./types/element";
import { Angle2Degree, EMU2PIX, createRandomCode } from "./util";

export enum SHAPE_TYPE {
    rect = "rect",
    roundRect = "rectRadius",
    snip1Rect = "rectMinusSingleAngle",
    snip2SameRect = "rectMinusSameSideAngle",
    snip2DiagRect = "rectMinusOppositeAngle",
    snipRoundRect = "rectSingleRadiusMinusSingleAngle",
    round1Rect = "rectSingleRadius",
    round2SameRect = "rectSameSideRadius",
    round2DiagRect = "rectOppositeRadius",
    ellipse = "oval",
    triangle = "triangle",
    rtTriangle = "rightTriangle",
    parallelogram = "parallelogram",
    trapezoid = "trapezoidal",
    diamond = "diamond",
    pentagon = "pentagon",
    hexagon = "hexagon", // 六边形
    heptagon = "heptagon", // 七边形
    octagon = "octagon", // 八边形
    decagon = "decagon", // 十边形
    dodecagon = "dodecagon", // 十二边形
    pie = "pieShape", // 饼形
    chord = "chordShape", // 弦形
    teardrop = "teardropShape", // 泪珠形
    frame = "frameShape", // 框架
    halfFrame = "halfClosedFrameShape", // 半闭框
    corner = "horn", // 角
    diagStripe = "twill", // 斜纹
    plus = "cross", // 十字形
    plaque = "cutawayRectangle", // 缺角矩形
    donut = "ring", // 环形
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

            // 锁定形状纵横比
            if (sp.nvSpPr.cNvSpPr.spLocks) shape.fixedRatio = true;

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
                } else if (sp.spPr.gradFill) {
                    const gradFill = new GradFill(sp.spPr.gradFill, this._theme);
                    shape.gradient = {
                        type: gradFill.type,
                        color: gradFill.color.map(c => { return { offset: +c.pos / 100000, value: c.value }; }),
                        rotate: gradFill.rotate
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

            // 水平翻转
            if (sp.spPr.xfrm._flipH) shape.flipH = -1;
            // 垂直翻转
            if (sp.spPr.xfrm._flipV) shape.flipV = -1;

            // 阴影
            if (sp.spPr.effectLst) {
                const outerShdw = sp.spPr.effectLst.outerShdw;
                const shapeColor = new Color(outerShdw, this._theme)
                const color = (shapeColor.color + Math.floor(255 * +shapeColor.alpha / 100000).toString(16)).toLocaleUpperCase();
                const degree = Angle2Degree(+outerShdw._dir || 0);
                const distance = EMU2PIX(outerShdw._dist || 0);
                const h = distance * Math.sin((90 - degree) / 180 * Math.PI);
                const v = distance * Math.sin(degree / 180 * Math.PI);
                shape.shadow = {
                    color,
                    h,
                    v,
                    blur: EMU2PIX(outerShdw._blurRad || 0)
                }
            }

            shapes.push(shape);
        }
        return shapes;
    }
}