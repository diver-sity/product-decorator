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
import { redoLog } from "../config/constants";
import { AxiosResponse } from "axios";

const fetchFromSource = async (firstPageURL: string) => {
    const remainingURLs = [firstPageURL];
    const paths = [];

    while (remainingURLs.length > 0) {
        const url = remainingURLs.pop();
        logger.info(`fetching ${url}`);

        let response;
        try {
            response = await fetchPage(url);
        } catch (error) {
            if (error.code === "ECONNABORTED") {
                throw new TimeoutError(`failed to fetch data around ${remainingURLs}`, error);
            }
            throw new ProductFetchError(`failed to fetch data around ${remainingURLs}`, error);
        }

        const data = response.data as ProductPagePayload;
        logger.debug(`products' length: ${
            data._embedded && data._embedded.product && data._embedded.product.length
            }`);
        if (!isEmpty(data)) {
            if (
                !isEmpty(data._links) && !isEmpty(data._links.next) &&
                !isEmpty(data._links.next.href)
            ) {
                remainingURLs.push(data._links.next.href);
            }

            try {
                await processPage(data, paths);
            } catch (error) {
                throw new FileOperationError(`failed to save data around ${remainingURLs}`, error);
            }
        }
    }

    return Promise.resolve(paths);
};

async function fetchPage(page: string): Promise<AxiosResponse> {
    return fs.promises.writeFile(redoLog, page, { flag: "w" })
        .then(() => axios.get(page));
}

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
