import Color from "./Color";
import GradFill from "./GradFill";
import SolidFill from "./SolidFill";
import Style from "./Style";
import { IR, ISp, ITheme } from "./types";
import { IPPTShapeElement, IPPTTextElement } from "./types/element";
import { IFontData } from "./types/font";
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
    private _ctx: CanvasRenderingContext2D;
    constructor(sp: ISp | ISp[], theme: ITheme) {
        this._theme = theme;
        const isArray = sp instanceof Array;
        if (!isArray) {
            this._sps = [sp];
        } else {
            this._sps = sp;
        }

        const canvas = document.createElement("canvas");
        canvas.style.width = "100px";
        canvas.style.height = "100px";

        // 调整分辨率
        const dpr = window.devicePixelRatio;
        canvas.width = 100 * dpr;
        canvas.height = 100 * dpr;
        this._ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        this._ctx.scale(dpr, dpr);
    }

    getFontSize(text: IFontData) {
        this._ctx.font = `${text.fontStyle} ${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
        const metrics = this._ctx.measureText(text.value);
        const width = metrics.width;
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        return { width, height };
    }

    get shapes() {
        // 文本框就是标准的形状加文本。
        const shapes: (IPPTShapeElement | IPPTTextElement)[] = [];
        for (const sp of this._sps) {
            const xfrm = sp.spPr.xfrm;
            let shape: IPPTShapeElement | IPPTTextElement | undefined;
            if (sp.nvSpPr.cNvSpPr._txBox) {
                // 文本框
                shape = {
                    id: createRandomCode(),
                    type: "text",
                    left: EMU2PIX(xfrm.off._x),
                    top: EMU2PIX(xfrm.off._y),
                    width: EMU2PIX(xfrm.ext._cx),
                    height: EMU2PIX(xfrm.ext._cy),
                    rotate: Math.floor(+(xfrm._rot || "0") / 60000),
                    name: sp.nvSpPr.cNvPr._name,
                    align: "left",
                    wordSpace: 0,
                    lineHeight: 1,
                    content: []
                };
            } else {
                // 形状
                shape = {
                    id: createRandomCode(),
                    fixedRatio: false,
                    left: EMU2PIX(xfrm.off._x),
                    top: EMU2PIX(xfrm.off._y),
                    width: EMU2PIX(xfrm.ext._cx),
                    height: EMU2PIX(xfrm.ext._cy),
                    rotate: Math.floor(+(xfrm._rot || "0") / 60000),
                    type: "shape",
                    name: sp.nvSpPr.cNvPr._name,
                    shape: SHAPE_TYPE[sp.spPr.prstGeom?._prst] || "rect",
                    content: []
                }

                // 锁定形状纵横比
                if (sp.nvSpPr.cNvSpPr.spLocks) shape.fixedRatio = true;
            }

            // 文本处理
            if (sp.txBody.p.r) {
                const texts: IFontData[] = [];
                const isArray = sp.txBody.p.r instanceof Array;
                let rs: IR[] = [];
                if (!isArray) {
                    rs = [sp.txBody.p.r as IR];
                } else {
                    rs = sp.txBody.p.r as IR[];
                }
                for (const r of rs) {
                    let fontColor = "#000";
                    if (r.rPr.solidFill) {
                        const solidFill = new SolidFill(r.rPr.solidFill, this._theme);
                        fontColor = solidFill.color;
                        if (solidFill.alpha) {
                            const alpha = +solidFill.alpha / 100000;
                            fontColor = (fontColor + Math.floor(255 * alpha).toString(16)).toLocaleUpperCase();
                        }
                    }

                    if (r.t.__text) {
                        for (const t of r.t.__text) {
                            const fontSize = (+(r.rPr._sz || "1350") / 100 / 3) * 4;
                            const text: IFontData = {
                                value: t,
                                fontSize,
                                width: 12,
                                height: 12,
                                fontStyle: r.rPr._i ? "italic" : "normal",
                                fontWeight: r.rPr._b ? "bold" : "normal",
                                fontFamily: r.rPr.latin?._typeface || this._theme.fontScheme._name,
                                fontColor,
                                underline: !!r.rPr._u,
                                strikout: false
                            };
                            const { width, height } = this.getFontSize(text);
                            text.width = width;
                            text.height = height;
    
                            texts.push(text);
                        }
                    }
                }

                const lastIndex = texts.length - 1;
                const lastText = lastIndex > -1 ? texts[lastIndex] : {};
                const text: IFontData = {
                    fontSize: 18,
                    width: 18,
                    height: 18,
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontFamily: "楷体",
                    fontColor: "#000",
                    underline: false,
                    strikout: false,
                    ...lastText,
                    value: "\n"
                };

                texts.push(text);

                shape.content = texts;
            }

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
                    if (style.fill) {
                        shape.fill = {
                            color: style.fill
                        }
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
                if (style.ln) {
                    shape.outline = {
                        color: style.ln,
                        width: EMU2PIX("12700")
                    }
                }
            }

            // 水平翻转
            if (xfrm._flipH) shape.flipH = -1;
            // 垂直翻转
            if (xfrm._flipV) shape.flipV = -1;

            // 阴影
            if (sp.spPr.effectLst?.outerShdw) {
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