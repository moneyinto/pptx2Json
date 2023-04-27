import Pptx2Json from "./Pptx2Json";

window.readZip = async () => {
    const input = document.getElementById("fileID") as HTMLInputElement;
    const zipFile = input.files && input.files.length > 0 ? input.files[0] : null;
    if (!zipFile) return;
    
    const pptx2Json = new Pptx2Json();
    const slides = await pptx2Json.read(zipFile);
    console.log(slides);
};

