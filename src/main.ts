import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from "fs";
import fetchFromSource from "./services/RestAPIExtractor";
import assembleSmallFiles from './services/InterimFileAssembler';
import { path } from './services/VideoLinkedProductLoader';
import logger from "./config/Logger";
import cleanUp from './services/Cleaner';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.close();

  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (error) {
    logger.error(`failed to clean up before starting, ${JSON.stringify(error)}`);
    process.exit(2)
  }

  let paths;
  try {
    paths = await fetchFromSource("https://eve.theiconic.com.au/catalog/products?page=1&page_size=1000&sort=activated_at");
  } catch (error) {
    logger.error(`failed to fetch data, ${JSON.stringify(error)}`);
  }

  try {
    assembleSmallFiles(paths);
  } catch (error) {
    logger.error(`failed to assemble temporary files, ${JSON.stringify(error)}`);
  }

  await cleanUp(paths);
}

bootstrap();
