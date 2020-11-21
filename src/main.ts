import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from "fs";
import fetchFromSource from "./services/RestAPIExtractor";
import assembleSmallFiles from './services/InterimFileAssembler';
import { path } from './services/VideoLinkedProductLoader';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.close();

  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (error) {
    console.error(`failed to clean up before starting, ${JSON.stringify(error)}`);
    process.exit(2)
  }

  let paths;
  try {
    paths = await fetchFromSource("https://eve.theiconic.com.au/catalog/products?page=1&page_size=1000");
  } catch (error) {
    console.error(`failed to fetch data, ${JSON.stringify(error)}`);
  }

  process.on("exit", async () => {
    if (paths) {
      const promises = paths.map(p => fs.unlink(p, () => {
        console.info(`cleaned up, ${p}`);
      }))
      await Promise.all(promises);
    }
  })
  assembleSmallFiles(paths);
}
bootstrap();
