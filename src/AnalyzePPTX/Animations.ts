import { IPar, ITiming } from "./types";
import { IPPTAnimation } from "./types/slide";
import { createRandomCode } from "./util";

export default class Animations {
    private _animations;
    constructor(timing: ITiming) {
        this._animations = this.dealAnimations(timing);
    }

    dealAnimations(timing: ITiming) {
        let parList: IPar[] = [];
        const animations: IPPTAnimation[] = [];
        const par = timing.tnLst.par.cTn.childTnLst.seq.cTn.childTnLst.par;
        if (par instanceof Array) {
            parList = par;
        } else {
            parList = [par];
        }

        for (const par of parList) {
            const cTn = par.cTn;
            let childParList: IPar[] = [];
            const childPar = cTn.childTnLst.par;
            if (childPar instanceof Array) {
                childParList = childPar;
            } else {
                childParList = [childPar];
            }
            
            for (const childPar of childParList) {
                const aPar = childPar.cTn.childTnLst.par;
                for (const bPar of aPar instanceof Array ? aPar : [aPar]) {
                    // path 路径动画
                    const type = {
                        entr: "in",
                        emph: "attention",
                        exit: "out",
                        path: "attention"
                    }[bPar.cTn._presetClass] as "in" | "out" | "attention";

                    let elId = "";
                    let ani = "";
                    let path = "";
                    if (bPar.cTn._presetClass === "path") {
                        elId = bPar.cTn.childTnLst.animMotion?.cBhvr.tgtEl.spTgt._spid;
                        ani = "custom";
                        path = bPar.cTn.childTnLst.animMotion?._path;
                    } else {
                        let animEffect: any = {};
                        let set: any = {};
                        for (const key in bPar.cTn.childTnLst) {
                            if (key.indexOf("anim") > -1) {
                                animEffect = bPar.cTn.childTnLst[key] instanceof Array ? bPar.cTn.childTnLst[key][0] : bPar.cTn.childTnLst[key];
                            } else if (key === "set") {
                                set = bPar.cTn.childTnLst[key] instanceof Array ? bPar.cTn.childTnLst[key][0] : bPar.cTn.childTnLst[key];
                            }
                        }
                        elId = set.cBhvr?.tgtEl.spTgt._spid || animEffect.cBhvr.tgtEl.spTgt._spid;
                        if (bPar.cTn._presetClass === "emph") {
                            // 强调动画 参数比较多
                            console.log("强调动画", animEffect);
                            ani = animEffect._clrSpc || animEffect._calcmode || "";
                        } else {
                            ani = bPar.cTn.childTnLst.animEffect?._filter;
                        }
                    }
                    const trigger = {
                        clickEffect: "click",
                        afterEffect: "auto",
                        withEffect: "meantime"
                    }[bPar.cTn._nodeType] as "click" | "meantime" | "auto";

                    const animation: IPPTAnimation = {
                        id: createRandomCode(),
                        elId,
                        type,
                        ani,
                        duration: 0,
                        trigger,
                        path
                    };
                    animations.push(animation);
                }
            }
        }

        return animations;
    }

    get animations() {
        return this._animations;
    }
}
