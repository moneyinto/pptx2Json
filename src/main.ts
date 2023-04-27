import AnalyzePPTX from "./AnalyzePPTX";

window.readZip = async () => {
    const input = document.getElementById("fileID") as HTMLInputElement;
    const zipFile = input.files && input.files.length > 0 ? input.files[0] : null;
    if (!zipFile) return;
    
    const analyzePPTX = new AnalyzePPTX();
    const slides = await analyzePPTX.read(zipFile);
    console.log(slides);
};
