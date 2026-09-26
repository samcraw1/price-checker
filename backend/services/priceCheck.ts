import pool from '../db';
import { scrapePrice, PriceNotFoundError } from '../scraper';
import { Listing, ListingRow, toListing } from '../types';

export class ListingNotFoundError extends Error {
    constructor(id: number | string) {
        super(`No listing with id ${id}`);
        this.name = 'ListingNotFoundError';
    }
}

export async function checkListing(id: number | string): Promise<Listing> {
    const result = await pool.query<ListingRow>('SELECT * FROM listings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        throw new ListingNotFoundError(id);
    }

    const price = await scrapePrice(result.rows[0].url);

    const updated = await pool.query<ListingRow>(
        'UPDATE listings SET price = $1, price_history = array_append(price_history, $1) WHERE id = $2 RETURNING *',
        [price, id]
    );

    await pool.query('INSERT INTO listings_history (listing_id, price) VALUES ($1, $2)', [id, price]);

    return toListing(updated.rows[0]);
}

export async function checkAllListings(): Promise<void> {
    const result = await pool.query<{ id: number }>('SELECT id FROM listings');

    for (const { id } of result.rows) {
        try {
            await checkListing(id);
        } catch (error) {
            if (error instanceof PriceNotFoundError) {
                console.error(`[priceCheck] listing ${id}: ${error.message}`);
            } else {
                console.error(`[priceCheck] listing ${id}: unexpected error`, error);
            }
        }
    }
}
