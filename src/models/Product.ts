export default interface Product {
    video_count: number;
    price: number;
    markdown_price: number;
    special_price: number;
    returnable: boolean;
    final_sale: boolean;
    final_price: number;
    sku: string;
    name: string;
    video_urls?: Array<string>
}