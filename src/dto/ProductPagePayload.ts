import Product from "src/models/Product";

export default interface ProductPagePayload {
    _links: {
        self: {
            href: string
        },
        first: {
            href: string
        },
        last: {
            href: string
        },
        next: {
            href: string
        },
    },
    _embedded: {
        product: Product[];
    },
    page_count: number,
    page_size: number,
    total_items: number,
    page: number
}
