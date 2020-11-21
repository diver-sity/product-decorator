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
            const response = await axios.get(remainingPage.pop());

            const data = response.data as ProductPagePayload;
            if (!isEmpty(data)) {
                let isLast = false;
                if (!isEmpty(data._links)) {
                    if (!isEmpty(data._links.next)) {
                        remainingPage.push(data._links.next.href);
                    } else {
                        isLast = true;
                    }
                }

                await processPage(data, paths);
            }
        }
    } catch (error) {
        console.error(`failed to fetch data around ${remainingPage}`, error);
    }


    return Promise.resolve();
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
        await Promise.all(withVideosOps).then(decoProducts => saveLinkedProducts(decoProducts, page));
    }
}

export default fetchFromSource;
