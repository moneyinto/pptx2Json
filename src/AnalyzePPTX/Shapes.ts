import Color from "./Color";
import GradFill from "./GradFill";
import SolidFill from "./SolidFill";
import Style from "./Style";
import { IDefRpr, IP, IR, ISldLayout, ISldMaster, ISp, ITexStyle, ITheme } from "./types";
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
};

const typeMap = {
    title: "title",
    subTitle: "body",
    ctrTitle: "title"
};

interface ILvlPpr {
    size: number;
    bold: boolean;
    italic: boolean;
    strike: boolean;
    fontColor: string;
    underline: boolean;
    fontFamily: string;
}

const SYS_FONTS = [
    { label: "Arial", value: "Arial" },
    { label: "微软雅黑", value: "Microsoft YaHei" },
    { label: "宋体", value: "SimSun" },
    { label: "黑体", value: "SimHei" },
    { label: "楷体", value: "KaiTi" },
    { label: "新宋体", value: "NSimSun" },
    { label: "仿宋", value: "FangSong" },
    { label: "苹方", value: "PingFang SC" },
    { label: "华文黑体", value: "STHeiti" },
    { label: "华文楷体", value: "STKaiti" },
    { label: "华文宋体", value: "STSong" },
    { label: "华文仿宋", value: "STFangSong" },
    { label: "华文中宋", value: "STZhongSong" },
    { label: "华文琥珀", value: "STHupo" },
    { label: "华文新魏", value: "STXinwei" },
    { label: "华文隶书", value: "STLiti" },
    { label: "华文行楷", value: "STXingkai" },
    { label: "冬青黑体", value: "Hiragino Sans GB" },
    { label: "兰亭黑", value: "Lantinghei SC" },
    { label: "偏偏体", value: "Hanzipen SC" },
    { label: "手札体", value: "Hannotate SC" },
    { label: "宋体", value: "Songti SC" },
    { label: "娃娃体", value: "Wawati SC" },
    { label: "行楷", value: "Xingkai SC" },
    { label: "圆体", value: "Yuanti SC" },
    { label: "华文细黑", value: "STXihei" },
    { label: "幼圆", value: "YouYuan" },
    { label: "隶书", value: "LiSu" }
];

export default class Shapes {
    private _sps: ISp[] = [];
    private _theme: ITheme;
    private _sldLayout: ISldLayout;
    private _sldMaster: ISldMaster;
    private _ctx: CanvasRenderingContext2D;
    private _titleLvlPprs: ILvlPpr[] = [];
    private _bodyLvlPprs: ILvlPpr[] = [];
    private _otherLvlPprs: ILvlPpr[] = [];
    private _layoutStyle: {
        [key: string]: ILvlPpr[];
    } = {};
    constructor(sp: ISp | ISp[], theme: ITheme, sldLayout: ISldLayout, sldMaster: ISldMaster) {
        this._theme = theme;
        this._sldLayout = sldLayout;
        this._sldMaster = sldMaster;
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

        this._titleLvlPprs = this.dealTexStyle(this._sldMaster.txStyles.titleStyle);
        this._bodyLvlPprs = this.dealTexStyle(this._sldMaster.txStyles.bodyStyle);
        this._otherLvlPprs = this.dealTexStyle(this._sldMaster.txStyles.otherStyle);

        this._layoutStyle = this.dealLayoutStyle();
    }

    getFontSize(text: IFontData) {
        this._ctx.font = `${text.fontStyle} ${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
        const metrics = this._ctx.measureText(text.value);
        const width = metrics.width;
        const height =
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        return { width, height };
    }

    dealTexStyle(texStyle: ITexStyle) {
        const lvlPprs = [];
        for (const key in texStyle) {
            if (key.indexOf("lvl") > -1) {
                const defRpr: IDefRpr = texStyle[key].defRPr;
                let fontColor = "";
                if (defRpr.solidFill?.schemeClr?._val) {
                    defRpr.solidFill.schemeClr._val = this._sldMaster.clrMap["_" + defRpr.solidFill.schemeClr._val];
                    const solidFill = new SolidFill(defRpr.solidFill, this._theme);
                    fontColor = solidFill.color;
                    if (solidFill.alpha) {
                        const alpha = +solidFill.alpha / 100000;
                        fontColor = (
                            fontColor + Math.floor(255 * alpha).toString(16)
                        ).toLocaleUpperCase();
                    }
                }
               
                lvlPprs.push({
                    size: (+defRpr._sz / 100 / 3) * 4,
                    bold: !!defRpr._b,
                    italic: !!defRpr._i,
                    strike: !!defRpr._strike,
                    fontColor,
                    underline: !!defRpr._u && defRpr._u !== "none",
                    defRpr,
                    align: texStyle[key]._algn
                });
            }
        }
        return lvlPprs;
    }

    dealLayoutStyle() {
        const layoutStyle: { [key: string]: ILvlPpr[]; } = {};
        let sps: ISp[] = [];
        if (this._sldLayout.cSld.spTree.sp instanceof Array) {
            sps = this._sldLayout.cSld.spTree.sp;
        } else {
            sps = [this._sldLayout.cSld.spTree.sp];
        }
        for (const sp of sps) {
            const type = sp.nvSpPr.nvPr.ph?._type || "other";
            layoutStyle[type] = this.dealTexStyle(sp.txBody.lstStyle);
        }
        return layoutStyle;
    }

    getLayoutStyle(
        type: string,
        lvl: string = "0"
    ) {
        const layoutStyles = this._layoutStyle[type] || [];
        return layoutStyles[+lvl] || {};
    }

    getTextStyle(
        type: "body" | "title" | "pic" | "tbl" | "dt" | "chart" | "other",
        lvl: string = "0"
    ) {
        switch (type) {
            case "title": {
                return this._titleLvlPprs[+lvl];
            }
            case "body": {
                return this._bodyLvlPprs[+lvl];
            }
            case "other": {
                return this._otherLvlPprs[+lvl];
            }
        }
        return null;
    }

    getFont(typeface: string) {
        let font = this._theme.fontScheme.minorFont;

        if (!typeface) {
            return font.latin._typeface;
        }

        if (typeface.indexOf("+mn") > -1) {
            font = this._theme.fontScheme.minorFont;
        } else {
            font = this._theme.fontScheme.majorFont;
        }

        if (typeface.indexOf("lt") > -1) {
            return font.latin._typeface;
        } else if (typeface.indexOf("ea") > -1) {
            return font.ea._typeface;
        } else {
            return font.cs._typeface || "Arial";
        }
    }

    get shapes() {
        // 文本框就是标准的形状加文本。
        const shapes: (IPPTShapeElement | IPPTTextElement)[] = [];
        for (const sp of this._sps) {
            let type = "";
            if (sp.nvSpPr.nvPr.ph?._type) {
                type = sp.nvSpPr.nvPr.ph._type;
            }
            const textType = typeMap[type] || type || "other";
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
                    lineHeight: 1.2,
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
                    align: "center",
                    lineHeight: 1.2,
                    wordSpace: 0,
                    content: []
                };

                // 锁定形状纵横比
                if (sp.nvSpPr.cNvSpPr.spLocks) shape.fixedRatio = true;
            }

            // 文本处理
            let pList: IP[] = [];
            if (sp.txBody.p instanceof Array) {
                pList = sp.txBody.p;
            } else {
                pList = [sp.txBody.p];
            }

            for (const p of pList) {
                const textStyle = this.getTextStyle(textType, p._lvl);
                const modeStyle: any = this.getLayoutStyle(type, p._lvl);
                // "ctr"|"dist"|"just"|"l"|"r"|"justLow"
                if (p.pPr?._algn) {
                    shape.align = { ctr: "center", l: "left", r: "right" }[
                        p.pPr._algn
                    ] || "left";
                } else if (modeStyle.align) {
                    shape.align = { ctr: "center", l: "left", r: "right" }[
                        modeStyle.align
                    ];
                }
                if (p.r) {
                    const texts: IFontData[] = [];
                    const isArray = p.r instanceof Array;
                    let rs: IR[] = [];
                    if (!isArray) {
                        rs = [p.r as IR];
                    } else {
                        rs = p.r as IR[];
                    }
                    for (const r of rs) {
                        let fontColor = modeStyle.fontColor || textStyle.fontColor || "#000000";
                        if (r.rPr.solidFill) {
                            if (r.rPr.solidFill.schemeClr) {
                                r.rPr.solidFill.schemeClr._val = this._sldMaster.clrMap["_" + r.rPr.solidFill.schemeClr._val] || r.rPr.solidFill.schemeClr._val;
                            }
                            const solidFill = new SolidFill(
                                r.rPr.solidFill,
                                this._theme
                            );
                            fontColor = solidFill.color;
                            if (solidFill.alpha) {
                                const alpha = +solidFill.alpha / 100000;
                                fontColor = (
                                    fontColor + Math.floor(255 * alpha).toString(16)
                                ).toLocaleUpperCase();
                            }
                        }
    
                        if (r.t.__text) {
                            const typeface = r.rPr.latin?._typeface || r.rPr.ea?._typeface || this.getFont(r.rPr.sym?._typeface || "");
                            const font = SYS_FONTS.find(f => f.label === typeface);
                            const fontFamily = font ? font.value : typeface;
                            
                            for (const t of r.t.__text) {
                                const fontSize = r.rPr._sz ? (+r.rPr._sz / 100 / 3) * 4 : (modeStyle.size || textStyle.size);
                                const text: IFontData = {
                                    value: t,
                                    fontSize,
                                    width: 24,
                                    height: 24,
                                    fontStyle: (r.rPr._i || (modeStyle.italic || textStyle.italic)) ? "italic" : "normal",
                                    fontWeight: (r.rPr._b || (modeStyle.bold || textStyle.bold)) ? "bold" : "normal",
                                    fontFamily,
                                    fontColor,
                                    underline: ((!!r.rPr._u && r.rPr._u !== "none") || modeStyle.underline || textStyle.underline),
                                    strikout: !!r.rPr._strike
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
                        fontSize: textStyle.size,
                        width: 24,
                        height: 24,
                        fontStyle: textStyle.italic ? "italic" : "normal",
                        fontWeight: textStyle.bold ? "bold" : "normal",
                        fontFamily: textStyle.fontFamily,
                        fontColor: textStyle.fontColor,
                        underline: textStyle.underline,
                        strikout: textStyle.strike,
                        ...lastText,
                        value: "\n"
                    };
    
                    texts.push(text);
    
                    shape.content = shape.content.concat(texts);
                }
            }

            const style = new Style(sp.style, this._theme);
            // 填充色
            if (!sp.spPr.noFill) {
                if (sp.spPr.solidFill) {
                    const solidFill = new SolidFill(
                        sp.spPr.solidFill,
                        this._theme
                    );
                    const opacity = +solidFill.alpha / 1000;
                    shape.fill = {
                        color: solidFill.color,
                        opacity
                    };
                } else if (sp.spPr.gradFill) {
                    const gradFill = new GradFill(
                        sp.spPr.gradFill,
                        this._theme
                    );
                    shape.gradient = {
                        type: gradFill.type,
                        color: gradFill.color.map((c) => {
                            return { offset: +c.pos / 100000, value: c.value };
                        }),
                        rotate: gradFill.rotate
                    };
                } else {
                    if (style.fill) {
                        shape.fill = {
                            color: style.fill
                        };
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
                    };
                }
            } else {
                if (style.ln) {
                    shape.outline = {
                        color: style.ln,
                        width: EMU2PIX("12700")
                    };
                }
            }

            // 水平翻转
            if (xfrm._flipH) shape.flipH = -1;
            // 垂直翻转
            if (xfrm._flipV) shape.flipV = -1;

            // 阴影
            if (sp.spPr.effectLst?.outerShdw) {
                const outerShdw = sp.spPr.effectLst.outerShdw;
                const shapeColor = new Color(outerShdw, this._theme);
                const color = (
                    shapeColor.color +
                    Math.floor((255 * +shapeColor.alpha) / 100000).toString(16)
                ).toLocaleUpperCase();
                const degree = Angle2Degree(+outerShdw._dir || 0);
                const distance = EMU2PIX(outerShdw._dist || 0);
                const h = distance * Math.sin(((90 - degree) / 180) * Math.PI);
                const v = distance * Math.sin((degree / 180) * Math.PI);
                shape.shadow = {
                    color,
                    h,
                    v,
                    blur: EMU2PIX(outerShdw._blurRad || 0)
                };
            }

            shapes.push(shape);
        }
        return shapes;
    }
}