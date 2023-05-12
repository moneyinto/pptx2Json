import BlipFill from "./BlipFill";
import Color from "./Color";
import SolidFill from "./SolidFill";
import { IPic, IRelationship, ITheme } from "./types";
import { IPPTAudioElement, IPPTImageElement, IPPTVideoElement } from "./types/element";
import { Angle2Degree, EMU2PIX, createRandomCode } from "./util";

export default class Pictures {
    private _pics: IPic[];
    private _theme: ITheme;
    private _relationships: IRelationship[];
    constructor(pic: IPic | IPic[], theme: ITheme, relationships: IRelationship[]) {
        this._theme = theme;
        this._relationships = relationships;
        const isArray = pic instanceof Array;
        if (!isArray) {
            this._pics = [pic];
        } else {
            this._pics = pic;
        }
    }

    get pictures() {
        const pictures: (IPPTImageElement | IPPTVideoElement | IPPTAudioElement)[] = [];
        for (const pic of this._pics) {
            const xfrm = pic.spPr.xfrm;
            const { videoFile, audioFile } = pic.nvPicPr.nvPr;

            const picture: IPPTImageElement | IPPTVideoElement | IPPTAudioElement = {
                id: createRandomCode(),
                originId: pic.nvPicPr.cNvPr._id,
                fixedRatio: false,
                left: EMU2PIX(xfrm.off._x),
                top: EMU2PIX(xfrm.off._y),
                width: EMU2PIX(xfrm.ext._cx),
                height: EMU2PIX(xfrm.ext._cy),
                type: videoFile ? "video" : audioFile ? "audio" : "image",
                name: pic.nvPicPr.cNvPr._name,
                rotate: Math.floor(+(xfrm._rot || "0") / 60000),
                streach: 0,
                src: ""
            };

            // 锁定形状纵横比
            if (pic.nvPicPr.cNvPicPr.picLocks) picture.fixedRatio = true;

            // 水平翻转
            if (xfrm._flipH) picture.flipH = -1;
            // 垂直翻转
            if (xfrm._flipV) picture.flipV = -1;

            if (pic.blipFill) {
                const blipFill = new BlipFill(pic.blipFill, this._relationships);
                picture.src = blipFill?.src.replace("..", "ppt") || "";
                if (videoFile || audioFile) (picture as (IPPTVideoElement | IPPTAudioElement)).cover = picture.src;
                picture.opacity = blipFill.opacity;
            }

            if (videoFile) {
                const link = videoFile["_r:link"];
                const relationship = this._relationships.find(r => r._Id === link);
                picture.src = relationship?._Target.replace("..", "ppt") || "";

            }

            if (audioFile) {
                const link = audioFile["_r:link"];
                const relationship = this._relationships.find(r => r._Id === link);
                picture.src = relationship?._Target.replace("..", "ppt") || ""
            }

            // 填充色
            if (pic.spPr.solidFill) {
                const solidFill = new SolidFill(pic.spPr.solidFill, this._theme);

                const opacity = +solidFill.alpha / 1000;
                picture.fill = {
                    color: solidFill.color,
                    opacity
                }
            }

            // 边框线
            if (pic.spPr.ln) {
                const ln = pic.spPr.ln;
                if (!ln.noFill && ln.solidFill) {
                    const solidFill = new SolidFill(ln.solidFill, this._theme);
                    const opacity = +solidFill.alpha / 1000;
                    const width = EMU2PIX(ln._w || "12700");
                    picture.outline = {
                        color: solidFill.color,
                        opacity,
                        width
                    }
                }
            }

            // 阴影
            if (pic.spPr.effectLst?.outerShdw) {
                const outerShdw = pic.spPr.effectLst.outerShdw;
                const shapeColor = new Color(outerShdw, this._theme)
                const color = (shapeColor.color + Math.floor(255 * +shapeColor.alpha / 100000).toString(16)).toLocaleUpperCase();
                const degree = Angle2Degree(+outerShdw._dir || 0);
                const distance = EMU2PIX(outerShdw._dist || 0);
                const h = distance * Math.sin((90 - degree) / 180 * Math.PI);
                const v = distance * Math.sin(degree / 180 * Math.PI);
                picture.shadow = {
                    color,
                    h,
                    v,
                    blur: EMU2PIX(outerShdw._blurRad || 0)
                }
            }

            pictures.push(picture);
        }
        return pictures;
    }
}