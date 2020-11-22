import { isEmpty } from "lodash";
import axios from "../config/axiosInstance";
import Product from "src/models/Product";
import VideoPreviewPayload from "src/dto/VideoPreviewPayload";
import { AxiosError } from "axios";
import logger from "../config/Logger";

const addVideoURL = async (product: Product) => {
    const url = `https://eve.theiconic.com.au/catalog/products/${product.sku}/videos`;
    return axios.get(url).then(response => {
        const payload = response.data as VideoPreviewPayload;
        if (payload._embedded && !isEmpty(payload._embedded.videos_url)) {
            const urls = payload._embedded.videos_url.map(e => e.url);
            product.video_urls = urls;
        }
        return product;
    }).catch((error: AxiosError) => {
        logger.warn(`failed to access ${url}, error: ${JSON.stringify(error.response.data)}`);
        return product;
    });
};

export default addVideoURL;
