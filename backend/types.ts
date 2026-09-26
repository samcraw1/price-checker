export type Product = {
    name: string;
    price: number;
    url: string;
    imageUrl: string;
    priceHistory: number[];
}

export type Listing = Product & {
    id: number;
}

export type ListingRow = {
    id: number;
    name: string;
    price: string;
    image_url: string;
    price_history: string[];
    url: string;
};

export function toListing(row: ListingRow): Listing {
    return {
        id: row.id,
        name: row.name,
        price: Number(row.price),
        imageUrl: row.image_url,
        priceHistory: row.price_history.map(Number),
        url: row.url,
    };
}
