import * as fs from "fs";
import { isEmpty } from "lodash";
import logger from "../config/Logger";
import { path } from "./VideoLinkedProductLoader";

const cleanUp = async (paths: Array<string>) => {
    if (paths && !isEmpty(paths)) {
        const promises = paths.map(p =>
            fs.promises
                .unlink(p)
                .then(() => logger.info(`cleaned up: ${p}`))
                .catch(error =>
                    logger.error(`cannot remove ${p}, error: ${JSON.stringify(error)}`)
                )
        );
        return Promise.all(promises);
    } else {
        return Promise.resolve();
    }
}

export const deleteExistingOutFile = () => {
    try {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    } catch (error) {
        logger.error(`failed to clean up before starting, ${JSON.stringify(error)}`);
        process.exit(2)
    }
}

export default cleanUp;
