import * as fs from "fs";
import fetchFromSource from "./services/RestAPIExtractor";
import assembleSmallFiles from './services/InterimFileAssembler';
import logger from "./config/Logger";
import cleanUp, { deleteExistingOutFile } from './services/Cleaner';
import TimeoutError from './errors/TimeoutError';
import { redoLog } from './config/constants';

async function bootstrap() {
  let paths = [];
  let productHost = process.env["PRODUCT_HOST"] || "https://eve.theiconic.com.au";
  try {
    paths = await fs.promises.readFile(redoLog)
      .then((buffer) => buffer.toString())
      .catch(error => {
        console.info(`no redoLog, starting from Page 1: `, JSON.stringify(error, undefined, 2));
        deleteExistingOutFile();
      }).then((url) => {
        return fetchFromSource(url || `${productHost}/catalog/products?page=1&page_size=1000&sort=activated_at`);
      })
  } catch (error) {
    logger.error(`${error.message}, ${JSON.stringify(error)}`);
    if (error instanceof TimeoutError) {
      process.exit(1);
    }
  }

  try {
    assembleSmallFiles(paths);
  } catch (error) {
    logger.error(`failed to assemble temporary files, ${error}`);
  }

  try {
    paths.push(redoLog);
    await cleanUp(paths);
  } catch (error) {
    logger.error(`failed to shut down correctly, ${error}`);
  }
}

bootstrap();
