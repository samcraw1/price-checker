import { Router } from 'express';
import pool from '../db';
import { Product, ListingRow, toListing, ErrorCodeForDebugging } from '../types';
import { checkListing, ListingNotFoundError } from '../services/priceCheck';
import { PriceNotFoundError } from '../scraper';

const router = Router();

router.get('/price-listings', async (request, response) => {
    try {
        const result = await pool.query<ListingRow>('SELECT * FROM listings');
        response.json(result.rows.map(toListing));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
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
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.post('/price-listings', async (request, response) => {
    const product = request.body as Product;
    if (!product.name || !product.price || !product.imageUrl || !product.priceHistory || !product.url) {
        const body: ErrorCodeForDebugging = {
            code: 400,
            message: 'Bad Request'
        };
        response.status(body.code).json(body);
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
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
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
        const body: ErrorCodeForDebugging = {
            code: 400,
            message: 'Bad Request'
        };
        response.status(body.code).json(body);
        return;
    }

    values.push(id);

    try {
        const result = await pool.query<ListingRow>(
            `UPDATE listings SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            const body: ErrorCodeForDebugging = {
                code: 404,
                message: 'Not Found'
            };
            response.status(body.code).json(body);
            return;
        }

        response.json(toListing(result.rows[0]));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.delete('/price-listings/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query('DELETE FROM listings WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            const body: ErrorCodeForDebugging = {
                code: 404,
                message: 'Not Found'
            };
            response.status(body.code).json(body);
            return;
        }

        response.status(204).send();
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.post('/price-listings/:id/check', async (request, response) => {
    const { id } = request.params;

    try {
        const listing = await checkListing(id);
        response.json(listing);
    } catch (error) {
        if (error instanceof ListingNotFoundError) {
            const body: ErrorCodeForDebugging = {
                code: 404,
                message: 'Not Found'
            };
            response.status(body.code).json(body);
            return;
        }
        if (error instanceof PriceNotFoundError) {
            response.status(502).send(error.message);
            return;
        }
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

export default router;
