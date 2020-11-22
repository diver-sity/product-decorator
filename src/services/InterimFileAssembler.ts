import * as fs from "fs";
import logger from "../config/Logger";
import { outPath } from "../config/constants";

const assembleSmallFiles = (zeroVideoPaths: Array<string>) => {
    //sequential operations to ensure the original order
    const exists = fs.existsSync(outPath);
    if (!exists) {
        fs.appendFileSync(outPath, "[");
    }
    if (zeroVideoPaths && zeroVideoPaths.length > 0) {
        zeroVideoPaths.forEach(p => {
            const data = fs.readFileSync(p)
            logger.info(`adding ${p}`);
            fs.appendFileSync(outPath, "," + data);
        });
    }
    fs.appendFileSync(outPath, "]");
}

export default assembleSmallFiles;