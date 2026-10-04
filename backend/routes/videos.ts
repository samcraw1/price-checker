import { Router } from 'express';
import pool from '../db';
import { NewVideo, VideoRow, toVideo, VIDEO_STATUSES, ErrorCodeForDebugging } from '../types';

const router = Router();

router.get('/videos', async (request, response) => {
    try {
        const result = await pool.query<VideoRow>('SELECT * FROM videos ORDER BY id DESC');
        response.json(result.rows.map(toVideo));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.post('/videos', async (request, response) => {
    const video = request.body as NewVideo;
    if (!video.title) {
        const body: ErrorCodeForDebugging = {
            code: 400,
            message: 'Bad Request'
        };
        response.status(body.code).json(body);
        return;
    }
    if (video.status && !VIDEO_STATUSES.includes(video.status)) {
        const body: ErrorCodeForDebugging = {
            code: 400,
            message: 'Bad Request'
        };
        response.status(body.code).json(body);
        return;
    }

    try {
        const result = await pool.query<VideoRow>(
            'INSERT INTO videos (title, status, notes) VALUES ($1, $2, $3) RETURNING *',
            [video.title, video.status ?? 'Idea', video.notes ?? null]
        );
        response.status(201).json(toVideo(result.rows[0]));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.put('/videos/:id', async (request, response) => {
    const { id } = request.params;
    const updates = request.body as Partial<NewVideo>;

    if (updates.status && !VIDEO_STATUSES.includes(updates.status)) {
        const body: ErrorCodeForDebugging = {
            code: 400,
            message: 'Bad Request'
        };
        response.status(body.code).json(body);
        return;
    }

    const fields: string[] = [];
    const values: unknown[] = [];
    const columnByKey: Record<keyof NewVideo, string> = {
        title: 'title',
        status: 'status',
        notes: 'notes',
    };

    for (const key of Object.keys(columnByKey) as (keyof NewVideo)[]) {
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
        const result = await pool.query<VideoRow>(
            `UPDATE videos SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
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

        response.json(toVideo(result.rows[0]));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.delete('/videos/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query('DELETE FROM videos WHERE id = $1', [id]);

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

export default router;
