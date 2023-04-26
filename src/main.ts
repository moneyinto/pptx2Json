import JSZip from "jszip";
import X2JS from "x2js";

window.readZip = async () => {
    const input = document.getElementById("fileID") as HTMLInputElement;
    console.log(input.files);
    const zipFile = input.files && input.files.length > 0 ? input.files[0] : null;
    if (!zipFile) return;
    const x2js = new X2JS();
    const jszip = new JSZip();
    const zip = await jszip.loadAsync(zipFile);
    // 读取zip
    console.log(zip.files);
    for (const key in zip.files) {
        // 循环判定是否有层级
        if (!zip.files[key].dir) {
            console.log(zip.files[key].name);
            const res = await zip.file(zip.files[key].name)!.async("string");
            const json = x2js.xml2js(res);
            console.log(json);
        }
    }
}
