interface VideoUrl {
    url: string,
    _links: {
        self: {
            href: string
        }
    }
}

export default interface VideoPreviewPayload {
    _links: {
        self: {
            href: string
        }
    },
    _embedded: {
        videos_url: VideoUrl[];
    },
    page_count: number,
    page_size: number,
    total_items: number,
    page: number
}
