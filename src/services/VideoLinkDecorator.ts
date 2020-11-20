import axios from "../config/axiosInstance";
import Product from "src/models/Product";
import VideoPreviewPayload from "src/dto/VideoPreviewPayload";

const addVideoURL = async (product: Product) => {
    return axios.get(`https://eve.theiconic.com.au/catalog/products/${product.sku}/videos`).then(response => {
        const payload = response.data as VideoPreviewPayload;
        const urls = payload._embedded.videos_url.map(e => e.url);
        product.video_urls = urls;
        return product;
    })
};

export default addVideoURL;
