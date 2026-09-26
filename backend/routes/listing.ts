import { Router } from 'express';
import pool from '../db';
import { Product, ListingRow, toListing } from '../types';
import { checkListing, ListingNotFoundError } from '../services/priceCheck';
import { PriceNotFoundError } from '../scraper';

const router = Router();

router.get('/price-listings', async (request, response) => {
    try {
        const result = await pool.query<ListingRow>('SELECT * FROM listings');
        response.json(result.rows.map(toListing));
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.get('/price-listings/:id/history', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query(
            'SELECT * FROM listings_history WHERE listing_id = $1',
            [id]
        );
        response.json(result.rows);
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.post('/price-listings', async (request, response) => {
    const product = request.body as Product;
    if (!product.name || !product.price || !product.imageUrl || !product.priceHistory || !product.url) {
        response.status(400).send('Bad Request');
        return;
    }

    try {
        const result = await pool.query<ListingRow>(
            'INSERT INTO listings (name, price, image_url, price_history, url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [product.name, product.price, product.imageUrl, product.priceHistory, product.url]
        );
        response.status(201).json(toListing(result.rows[0]));
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.put('/price-listings/:id', async (request, response) => {
    const { id } = request.params;
    const updates = request.body as Partial<Product>;

    const fields: string[] = [];
    const values: unknown[] = [];
    const columnByKey: Record<keyof Product, string> = {
        name: 'name',
        price: 'price',
        imageUrl: 'image_url',
        priceHistory: 'price_history',
        url: 'url',
    };

    for (const key of Object.keys(columnByKey) as (keyof Product)[]) {
        if (updates[key] !== undefined) {
            values.push(updates[key]);
            fields.push(`${columnByKey[key]} = $${values.length}`);
        }
    }

    if (fields.length === 0) {
        response.status(400).send('Bad Request');
        return;
    }

    values.push(id);

    try {
        const result = await pool.query<ListingRow>(
            `UPDATE listings SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            response.status(404).send('Not Found');
            return;
        }

        response.json(toListing(result.rows[0]));
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.delete('/price-listings/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query('DELETE FROM listings WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            response.status(404).send('Not Found');
            return;
        }

        response.status(204).send();
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.post('/price-listings/:id/check', async (request, response) => {
    const { id } = request.params;

    try {
        const listing = await checkListing(id);
        response.json(listing);
    } catch (error) {
        if (error instanceof ListingNotFoundError) {
            response.status(404).send('Not Found');
            return;
        }
        if (error instanceof PriceNotFoundError) {
            response.status(502).send(error.message);
            return;
        }
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

export default router;
