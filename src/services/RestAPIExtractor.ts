import * as fs from "fs";
import { isEmpty } from "lodash";
import axios from "../config/axiosInstance";
import ProductPagePayload from "src/dto/ProductPagePayload";
import saveProducts from "./ZeroVideoProductLoader";
import saveLinkedProducts from "./VideoLinkedProductLoader";
import addVideoURL from "./VideoLinkDecorator";
import logger from "../config/Logger";
import ProductFetchError from "../errors/ProductFetchError";
import FileOperationError from "../errors/FileOperationError";
import TimeoutError from "../errors/TimeoutError";
import { redoLog } from "src/config/constants";

const fetchFromSource = async (firstPageURL: string) => {
    const remainingPage = [firstPageURL];
    const paths = [];

    while (remainingPage.length > 0) {
        const page = remainingPage.pop();
        logger.info(`fetching ${page}`);
        let response;

        try {
            response = await fs.promises.writeFile(redoLog, page, { flag: "w" })
                .then(() => axios.get(page));
        } catch (error) {
            if (error.code === "ECONNABORTED") {
                throw new TimeoutError(`failed to fetch data around ${remainingPage}`, error);
            }
            throw new ProductFetchError(`failed to fetch data around ${remainingPage}`, error);
        }

        const data = response.data as ProductPagePayload;
        logger.debug(`products' length: ${
            data._embedded &&
            data._embedded.product &&
            data._embedded.product.length
            }`);
        // if (data.page > 2) {
        //     return Promise.resolve(paths);
        // }
        if (!isEmpty(data)) {
            if (!isEmpty(data._links)) {
                if (!isEmpty(data._links.next)) {
                    remainingPage.push(data._links.next.href);
                }
            }

            try {
                await processPage(data, paths);
            } catch (error) {
                throw new FileOperationError(`failed to save data around ${remainingPage}`, error);
            }
        }
    }

    return Promise.resolve(paths);
};

async function processPage(data: ProductPagePayload, paths: Array<string>) {
    const page = data.page;

    if (!isEmpty(data._embedded) && !isEmpty(data._embedded.product)) {
        const products = data._embedded.product;
        const withoutVideos = products.filter(p => p.video_count == 0);
        await saveProducts(withoutVideos, page).then((path) => {
            if (path) {
                paths.push(path);
            }
        });

        const withVideos = products.filter(p => p.video_count > 0);
        const withVideosOps = withVideos.map(p => addVideoURL(p))
        logger.info(`adding video links to ${withVideos.length}`);
        if (page === 1) {
            await Promise.all(withVideosOps)
                .then(decoProducts => saveLinkedProducts(decoProducts, page));
        } else {
            while (withVideosOps.length > 0) {
                const opsThisTime = withVideosOps.splice(0, 30);
                await Promise.all(opsThisTime)
                    .then(decoProducts => saveLinkedProducts(decoProducts, page));
            }
        }
    }
}

export default fetchFromSource;
