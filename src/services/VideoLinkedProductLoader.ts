import * as fs from "fs";
import Product from "src/models/Product";

export const path = `/tmp/out.json`;

const saveProducts = (products: Array<Product>, pageNumber: number): Promise<void | string> => {
    if (products.length === 0) {
        return Promise.resolve();
    }

    let output = JSON.stringify(products);
    if (pageNumber === 1) {
        return fs.promises.appendFile(path, output.substring(0, output.length - 1), { flag: "a" })
    } else {
        return fs.promises.appendFile(path, "," + output.substr(1, output.length - 2), { flag: "a" })
    }
}

export default saveProducts;
