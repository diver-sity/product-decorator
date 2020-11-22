import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from "fs";
import fetchFromSource, { redoLog } from "./services/RestAPIExtractor";
import assembleSmallFiles from './services/InterimFileAssembler';
import logger from "./config/Logger";
import cleanUp, { deleteExistingOutFile } from './services/Cleaner';
import TimeoutError from './errors/TimeoutError';


async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.close();

  let paths = [];
  try {
    paths = await fs.promises.readFile(redoLog)
      .then((buffer) => buffer.toString())
      .catch(error => {
        console.info(`no redoLog, starting from Page 1: `, JSON.stringify(error, undefined, 2));
        deleteExistingOutFile();
      }).then((url) => {
        return fetchFromSource(url || "https://eve.theiconic.com.au/catalog/products?page=1&page_size=1000&sort=activated_at");
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
