import { isEmpty } from "lodash";
import axios from "../config/axiosInstance";
import ProductPagePayload from "src/dto/ProductPagePayload";

const fetchFromSource = async (firstPageURL: string) => {
    const remainingPage = [firstPageURL];

    try {
        while (remainingPage.length > 0) {
            const response = await axios.get(remainingPage.pop());

            const data = response.data as ProductPagePayload;
            if (!isEmpty(data) && !isEmpty(data._links) && !isEmpty(data._links.next)) {
                remainingPage.push(data._links.next.href);
            }
        }
    } catch (error) {
        console.error(`failed to fetch data around ${remainingPage}`, error);
    }


    return Promise.resolve();
};

export default fetchFromSource;
