import * as fs from "fs";
import { v4 as getId } from "uuid";
import Product from "src/models/Product";

const saveProducts = (products: Array<Product>, pageNumber: number) => {
    const path = `/tmp/product-decorator-${pageNumber}-${getId()}.txt`;
    const output = JSON.stringify(products);
    return fs.promises.writeFile(path, output.substring(1, output.length - 1))
        .then(() => path)
}

export default saveProducts;