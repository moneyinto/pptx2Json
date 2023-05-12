import JSZip from "jszip";
import X2JS from "x2js";
import Theme from "./Theme";
import Slide from "./Slide";
import { ISlide } from "./types/slide";
import { ISlideLayout, ISlideMaster } from "./types";

export default class AnalyzePPTX {
    public slides: ISlide[] = [];
    constructor() {
        
    }

    public async read(zipFile: File) {
        const x2js = new X2JS();
        const jszip = new JSZip();
        const zip = await jszip.loadAsync(zipFile);
        const xml = {};
        for (const key in zip.files) {
            // 循环判定是否有层级
            if (!zip.files[key].dir) {
                const path = zip.files[key].name;
                if (/.xml$/.test(path) || /.rels$/.test(path)) {
                    const res = await zip.file(zip.files[key].name)!.async("string");

                    xml[path] = x2js.xml2js(res);
                }
            }
        }
        
        const themeXML= xml["ppt/theme/theme1.xml"];
        const theme = new Theme(themeXML).theme;

        const slideMasterXML: ISlideMaster = xml["ppt/slideMasters/slideMaster1.xml"];
        const slides: ISlide[] = [];
        try {
            for (const key in xml) {
                if (/ppt\/slides\/slide[\d]+.xml$/.test(key)) {
                    const n = /\d+/.exec(key)![0];
                    const relKey = `ppt/slides/_rels/slide${n}.xml.rels`;
                    const slideRel = xml[relKey];
                    let slideLayoutXML: ISlideLayout;
                    for (const relationship of slideRel.Relationships.Relationship) {
                        if (/slideLayout[\d]+.xml$/.test(relationship._Target)) {
                            const key = relationship._Target.replace("..", "ppt");
                            slideLayoutXML = xml[key];
                        }
                    }
                    const slide = new Slide(xml[key].sld, slideRel, theme, n, zip, x2js, slideLayoutXML.sldLayout, slideMasterXML.sldMaster);
                    const result: ISlide = await slide.getSlide();
                    slides.push(result);
                }
            }

            return slides.sort((a, b) => a.index - b.index).map(slide => {
                delete slide.index;
                return slide;
            });
        } catch(err) {
            console.error(err);
            return slides;
        }
    }
}
