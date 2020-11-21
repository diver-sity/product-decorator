import * as fs from "fs";
import { path } from "./VideoLinkedProductLoader";


const assembleSmallFiles = (zeroVideoPaths: Array<string>) => {
    const exists = fs.existsSync(path);
    if (!exists) {
        fs.appendFileSync(path, "[");
    }
    zeroVideoPaths.forEach(p => {
        const data = fs.readFileSync(p)
        fs.appendFileSync(path, "," + data);
    });
    fs.appendFileSync(path, "]");
}

export default assembleSmallFiles;