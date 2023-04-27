export interface ISchemeClr {
    _val: string;
    alpha?: {
        _val: string;
    };
}

export interface ISolidFill {
    schemeClr: ISchemeClr;
}

export interface IBlipFill {
    blip: {
        "_r:embed": string;
    };
    stretch?: {
        fillRect: {
            _l: string;
            _r: string;
        }
    };
    tile?: {
        _algn: "tl" | "t" | "tr" | "l" | "ctr" | "r" | "bl" | "b" | "br";
        _flip: "none" | "x" | "y" | "xy";
        _sx: string;
        _sy: string;
        _tx: string;
        _ty: string;
    };
}

export interface IBgPr {
    solidFill?: ISolidFill;
    blipFill?: IBlipFill;
}

export interface IBg {
    bgPr: IBgPr;
}

export interface IRelationship {
    _Id: string;
    _Target: string;
}
