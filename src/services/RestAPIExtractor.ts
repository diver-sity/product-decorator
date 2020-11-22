import { isEmpty } from "lodash";
import axios from "../config/axiosInstance";
import ProductPagePayload from "src/dto/ProductPagePayload";
import saveProducts from "./ZeroVideoProductLoader";
import saveLinkedProducts from "./VideoLinkedProductLoader";
import addVideoURL from "./VideoLinkDecorator";

const fetchFromSource = async (firstPageURL: string) => {
    const remainingPage = [firstPageURL];
    const paths = [];

    try {
        while (remainingPage.length > 0) {
            const page = remainingPage.pop();
            console.info(`fetching ${page}`);
            const response = await axios.get(page);

            const data = response.data as ProductPagePayload;
            console.debug(`products' length: ${data._embedded && data._embedded.product && data._embedded.product.length}`);
            if (!isEmpty(data)) {
                if (!isEmpty(data._links)) {
                    if (!isEmpty(data._links.next)) {
                        remainingPage.push(data._links.next.href);
                    }
                }

                await processPage(data, paths);
            }
        }
    } catch (error) {
        //TODO: may fail fast
        console.error(`failed to fetch data around ${remainingPage}`, error);
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
        console.info(`adding video links to ${withVideos.length}`);
        if (page === 1) {
            await Promise.all(withVideosOps)
                .then(decoProducts => saveLinkedProducts(decoProducts, page));
        } else {
            while (withVideosOps.length > 0) {
                const opsThisTime = withVideosOps.splice(0, 20);
                await Promise.all(opsThisTime)
                    .then(decoProducts => saveLinkedProducts(decoProducts, page));
            }
        }
    }
}

export default fetchFromSource;
