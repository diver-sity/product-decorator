import { promises as fs } from "fs";
import Product from "src/models/Product";
import { outPath } from "../config/constants";

const saveProducts = (products: Array<Product>, pageNumber: number): Promise<void | string> => {
    if (products.length === 0) {
        return Promise.resolve();
    }

    let output = JSON.stringify(products);
    if (pageNumber === 1) {
        return fs.appendFile(outPath, output.substring(0, output.length - 1), { flag: "a" })
    } else {
        return fs.stat(outPath).then(() => {
            return fs.appendFile(outPath, "," + output.substr(1, output.length - 2), { flag: "a" })
        }).catch(error => {
            console.info(`${outPath} not found`, JSON.stringify(error, undefined, 2));
            return fs.appendFile(outPath, "[" + output.substr(1, output.length - 2), { flag: "a" })
        })
    }
}

export default saveProducts;
