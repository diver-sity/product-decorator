import * as fs from "fs";
import { path } from "./VideoLinkedProductLoader";
import logger from "../config/Logger";

const assembleSmallFiles = (zeroVideoPaths: Array<string>) => {
    //sequential operations to ensure the original order
    const exists = fs.existsSync(path);
    if (!exists) {
        fs.appendFileSync(path, "[");
    }
    zeroVideoPaths.forEach(p => {
        const data = fs.readFileSync(p)
        logger.info(`adding ${p}`);
        fs.appendFileSync(path, "," + data);
    });
    fs.appendFileSync(path, "]");
}

export default assembleSmallFiles;