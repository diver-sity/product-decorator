import * as fs from "fs";
import logger from "../config/Logger";

const cleanUp = async (paths: Array<string>) => {
    if (paths) {
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

export default cleanUp;
