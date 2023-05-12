
export interface IGradientColor {
    offset: number;
    value: string;
}

type IAlgn = "tl" | "t" | "tr" | "l" | "ctr" | "r" | "bl" | "b" | "br";

export interface ISchemeClr {
    _val: string;
    alpha?: {
        _val: string;
    };
    lumMod?: {
        _val: string;
    };
    lumOff?: {
        _val: string;
    };
    tint?: {
        _val: string;
    }
}

type ISrgbClr = ISchemeClr;
type IPrstClr = ISchemeClr;

export interface ISolidFill {
    schemeClr?: ISchemeClr;
    srgbClr?: ISrgbClr;
    prstClr?: IPrstClr;
}

export interface IBlipFill {
    blip: {
        "_r:embed": string;
        alphaModFix?: {
            _amt: string;
        }
    };
    stretch?: {
        fillRect: {
            _l: string;
            _r: string;
        };
    };
    tile?: {
        _algn: IAlgn;
        _flip: "none" | "x" | "y" | "xy";
        _sx: string;
        _sy: string;
        _tx: string;
        _ty: string;
    };
}

export interface IGS {
    _pos: string;
    schemeClr: ISchemeClr;
}

export interface IGradFill {
    gsLst: {
        gs: IGS[];
    };
    lin?: {
        _ang: string;
        _scaled: string;
    };
    path?: {
        fillToRect: {
            _b: string;
            _l: string;
            _r: string;
            _t: string;
        };
    };
}

interface IBgPr {
    solidFill?: ISolidFill;
    blipFill?: IBlipFill;
    gradFill?: IGradFill;
}

export interface IBg {
    bgPr: IBgPr;
}

export interface IRelationship {
    _Id: string;
    _Target: string;
}

interface IPrstDash {
    _val: string;
}

interface ILn {
    noFill?: {};
    miter: {
        _lim: string;
    };
    prstDash: IPrstDash;
    solidFill: ISolidFill;
    _algn: IAlgn;
    _cap: string;
    _cmpd: string;
    _w: string;
}

interface IFmtScheme {
    bgFillStyleLst: {
        gradFill: IGradFill;
        solidFill: ISolidFill[];
    };
    effectStyleLst: any;
    fillStyleLst: {
        gradFill: IGradFill[];
        solidFill: ISolidFill;
    };
    lnStyleLst: {
        ln: ILn[];
    };
}

interface IFontScheme {
    majorFont: any;
    minorFont: any;
    _name: string;
}

export interface ITheme {
    clrScheme: {
        [key: string]: any;
    };
    fmtScheme: IFmtScheme;
    fontScheme: IFontScheme;
}

interface IXfrm {
    chExt?: { _cx: string; _cy: string };
    chOff?: { _x: string; _y: string };
    ext: { _cx: string; _cy: string };
    off: { _x: string; _y: string };
    _rot?: string;
    _flipH?: string;
    _flipV?: string;
}

interface ICNvPr {
    _id: string;
    _name: string;
}

interface ICNvSpPr {
    spLocks?: {};
    _txBox?: string;
}

interface INvPr {
    videoFile?: {
        "_r:link": string;
    };
    audioFile?: {
        "_r:link": string;
    };
    ph?: {
        _type: "body" | "ctrTitle" | "title" | "pic" | "subTitle" | "tbl" | "dt" | "chart"
    }
}

interface INvSpPr {
    cNvPr: ICNvPr;
    cNvSpPr: ICNvSpPr;
    nvPr: INvPr;
}

interface IPrstGeom {
    avLst: {};
    _prst: string;
}

interface IOuterShdw {
    srgbClr: ISrgbClr;
    _algn: IAlgn;
    _blurRad: string;
    _dir: string;
    _dist: string;
    _rotWithShape: string;
}

interface ISpPr {
    ln?: {
        noFill?: {};
        solidFill?: ISolidFill;
        _w?: string;
        prstDash?: {
            _val: "solid" | "dashed";
        };
        tailEnd?: {
            _type: "arrow" | "dot";
        };
        headEnd?: {
            _type: "arrow" | "dot";
        };
    };
    noFill?: {};
    prstGeom?: IPrstGeom;
    xfrm: IXfrm;
    solidFill?: ISolidFill;
    gradFill?: IGradFill;
    effectLst?: {
        outerShdw: IOuterShdw;
    };
}

interface IEffectRef {
    schemeClr: ISchemeClr;
    _idx: string;
}

type IFillRef = IEffectRef;
type IFontRef = IEffectRef;
type ILnRef = IEffectRef;

interface IStyle {
    effectRef: IEffectRef;
    fillRef: IFillRef;
    fontRef: IFontRef;
    lnRef: ILnRef;
}

interface IBodyPr {
    _anchor: string;
    _rtlCol: string;
}

interface IPPr {
    _algn: IAlgn;
}

interface IEA {
    _charset: string;
    _typeface: string;
}

interface IR {
    rPr: {
        ea?: IEA;
        latin?: IEA;
        sym?: {
            _typeface: string;
        };
        _b?: {};
        _i?: {};
        _u?: {};
        solidFill?: ISolidFill;
        _sz?: string;
        _strike?: {};
    };
    t: {
        __text: string;
    };
}

export interface IP {
    endParaRPr: {
        _altLang: "en-US";
        _lang: "zh-CN";
    };
    r?: IR | IR[];
    pPr?: IPPr;
    _lvl?: string;
}

export interface ITxBody {
    bodyPr: IBodyPr;
    p: IP | IP[];
    lstStyle: ITexStyle;
}

interface ICNvCxnSpPr {}

interface INvCxnSpPr {
    cNvCxnSpPr: ICNvCxnSpPr;
    cNvPr: ICNvPr;
    nvPr: INvPr;
}

interface ICNvPicPr {
    picLocks: {};
}

interface INvPicPr {
    cNvPicPr: ICNvPicPr;
    cNvPr: ICNvPr;
    nvPr: INvPr;
}

export interface ISp {
    nvSpPr: INvSpPr;
    spPr: ISpPr;
    style: IStyle;
    txBody: ITxBody;
}

export interface ICxnSp {
    nvCxnSpPr: INvCxnSpPr;
    spPr: ISpPr;
    style: IStyle;
}

export interface IPic {
    spPr: ISpPr;
    blipFill: IBlipFill;
    nvPicPr: INvPicPr;
}

interface INvGrpSpPr {
    cNvGrpSpPr: {};
    cNvPr: ICNvPr;
    nvPr: INvPr;
}

interface IGrpSpPr {
    xfrm?: IXfrm;
}

interface IGraphicFrame {
    graphic: {
        graphicData: {
            chart?: {
                "_r:id": string;
            };
            tbl?: {

            };
        };
    };
    nvGraphicFramePr: {
        cNvGraphicFramePr: {};
        cNvPr: ICNvPr;
        nvPr: INvPr;
    };
    xfrm: IXfrm;
}

interface ISpTree {
    grpSpPr: IGrpSpPr;
    nvGrpSpPr: INvGrpSpPr;
    sp?: ISp | ISp[];
    cxnSp?: ICxnSp | ICxnSp[];
    pic?: IPic | IPic[];
    graphicFrame?: IGraphicFrame | IGraphicFrame[];
}

export interface IPT {
    _idx: string;
    v: {
        __text: string;
    }
}

interface IStrRef {
    strCache: {
        pt: IPT | IPT[];
        ptCount: {
            _val: string;
        };
    };
}

interface INumRef {
    numCache: {
        formatCode: {
            __text: string;
        };
        pt: {
            _idx: string;
            v: {
                __text: string;
            }
        }[];
        ptCount: {
            _val: string;
        };
    }
}

export interface ISer {
    cat: {
        strRef: IStrRef;
    };
    dLbls: {
        delete: {
            _val: string;
        };
    };
    idx: {
        _val: string;
    };
    invertIfNegative: {
        _val: string;
    };
    order: {
        _val: string;
    };
    spPr: ISpPr;
    tx: {
        strRef: IStrRef;
    };
    val: {
        numRef: INumRef;
    };
}

interface ITypeChart {
    axId?: { _val: string; }[];
    dLbls: {
        showLegendKey: {};
        showVal: {};
        showCatName: {};
        showSerName: {};
        showPercent: {};
    };
    grouping?: { _val: string };
    ser: ISer | ISer[];
    varyColors: {};
}

interface IBarChart extends ITypeChart {
    barDir: { _val: string; };
    gapWidth: { _val: string; };
    overlap: { _val: string; };
}

interface ILineChart extends ITypeChart {
    smooth: {};
    marker: {};
}

interface IPieChart extends ITypeChart {
    firstSliceAng: {};
}

export interface IChart {
    chartSpace: {
        chart: {
            autoTitleDeleted: {
                _val: string;
            };
            dispBlanksAs: {
                _val: string;
            };
            legend: {
                layout: {};
                legendPos: {
                    _val: string;
                };
                overlay: {
                    _val: string;
                };
                spPr: {
                    effectLst: {};
                    ln: ILn;
                    noFill?: {};
                };
                txPr: {
                    bodyPr: {
                        _anchor: string;
                        _anchorCtr: string;
                        _rot: string;
                        _spcFirstLastPara: string;
                        _vert: string;
                        _vertOverflow: string;
                        _wrap: string;
                    };
                    lstStyle: {};
                }
            };
            plotArea: {
                catAx: {};
                layout: {};
                barChart?: IBarChart;
                lineChart?: ILineChart;
                pieChart?: IPieChart;
            }
        }
    }
}

interface ICSld {
    bg?: IBg;
    spTree: ISpTree;
}

export interface IDefRpr {
    latin: {
        _typeface: string;
    };
    solidFill: ISolidFill;
    _b?: string;
    _i?: string;
    _sz?: string;
    _u?: string;
    _strike?: string;
}

interface ILvlPPR {
    defRPr: IDefRpr;
}

interface ITexStyle {
    lvl1pPr: ILvlPPR;
    lvl2pPr?: ILvlPPR;
    lvl3pPr?: ILvlPPR;
    lvl4pPr?: ILvlPPR;
    lvl5pPr?: ILvlPPR;
    lvl6pPr?: ILvlPPR;
    lvl7pPr?: ILvlPPR;
    lvl8pPr?: ILvlPPR;
    lvl9pPr?: ILvlPPR;
}

export interface ISldMaster {
    cSld: ICSld;
    clrMap: {
        [key: string]: string;
    };
    txStyles: {
        bodyStyle: ITexStyle;
        otherStyle: ITexStyle;
        titleStyle: ITexStyle;
    };
}

interface ISldLayout {
    cSld: ICSld;
    clrMapOvr: {};
}

export interface ISlideMaster {
    sldMaster: ISldMaster;
}

export interface ISlideLayout {
    sldLayout: ISldLayout;
}

export interface IXSlide {
    cSld: ICSld;
    clrMapOvr: {};
}
