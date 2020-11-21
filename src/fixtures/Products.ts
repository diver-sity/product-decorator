import Product from "src/models/Product";

export const socks: Product = {
    video_count: 2,
    price: 2.5,
    markdown_price: 2,
    special_price: 1.5,
    returnable: false,
    final_sale: false,
    final_price: null,
    sku: "ksk53-skd82-gg232-jd8s2",
    name: "soccer socks"
}

export const productWithVideo: Product = {
    video_count: 2,
    price: 2.5,
    markdown_price: 2,
    special_price: 1.5,
    returnable: false,
    final_sale: false,
    final_price: null,
    sku: "ksk53-skd82-gg232-jd8s2",
    name: "soccer socks"
}

export const productWithVideoURL: Product = {
    video_count: 2,
    video_urls: ["proto://host/products/idis3", "proto://host:port/products/idis3"],
    price: 2.5,
    markdown_price: 2,
    special_price: 1.5,
    returnable: false,
    final_sale: false,
    final_price: null,
    sku: "ksk53-skd82-gg232-jd8s2",
    name: "soccer socks"
}

export const productWithNoVideo: Product = {
    video_count: 0,
    price: 2.5,
    markdown_price: 2,
    special_price: 1.5,
    returnable: false,
    final_sale: false,
    final_price: null,
    sku: "cc3i2-smwd82-gg232-jd8s2",
    name: "invisible clock"
}

