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
}

export interface ISolidFill {
    schemeClr?: ISchemeClr;
    srgbClr?: ISchemeClr;
}

export interface IBlipFill {
    blip: {
        "_r:embed": string;
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
}

interface ICNvPr {
    _id: string;
    _name: string;
}

interface ICNvSpPr {}

interface INvPr {}

interface INvSpPr {
    cNvPr: ICNvPr;
    cNvSpPr: ICNvSpPr;
    nvPr: INvPr;
}

interface IPrstGeom {
    avLst: {};
    _prst: string;
}

interface ISpPr {
    prstGeom: {};
    xfrm: IXfrm;
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

interface ITxBody {
    bodyPr: IBodyPr;
    p: {
        endParaRPr: {
            _altLang: "en-US";
            _lang: "zh-CN";
        };
        pPr: IPPr;
    };
}

interface ISp {
    nvSpPr: INvSpPr;
    spPr: ISpPr;
    style: IStyle;
    txBody: ITxBody;
}

interface INvGrpSpPr {
    cNvGrpSpPr: {};
    cNvPr: ICNvPr;
    nvPr: INvPr;
}

interface IGrpSpPr {
    xfrm?: IXfrm;
}

interface ISpTree {
    grpSpPr: IGrpSpPr;
    nvGrpSpPr: INvGrpSpPr;
    sp: ISp | ISp[];
}

interface ICSld {
    bg?: IBg;
    spTree: ISpTree;
}

export interface IXSlide {
    cSld: ICSld;
    clrMapOvr: {};
}
