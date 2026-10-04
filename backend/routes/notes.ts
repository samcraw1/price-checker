import { Router } from 'express';
import pool from '../db';
import { NewNote, NoteRow, toNote, ErrorCodeForDebugging } from '../types';

const router = Router();

router.get('/notes', async (request, response) => {
    try {
        const result = await pool.query<NoteRow>('SELECT * FROM notes ORDER BY created_at DESC');
        response.json(result.rows.map(toNote));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.post('/notes', async (request, response) => {
    const note = request.body as NewNote;
    if (!note.title || !note.body) {
        const body: ErrorCodeForDebugging = {
            code: 400,
            message: 'Bad Request'
        };
        response.status(body.code).json(body);
        return;
    }

    try {
        const result = await pool.query<NoteRow>(
            'INSERT INTO notes (title, body) VALUES ($1, $2) RETURNING *',
            [note.title, note.body]
        );
        response.status(201).json(toNote(result.rows[0]));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.put('/notes/:id', async (request, response) => {
    const { id } = request.params;
    const updates = request.body as Partial<NewNote>;

    const fields: string[] = [];
    const values: unknown[] = [];
    const columnByKey: Record<keyof NewNote, string> = {
        title: 'title',
        body: 'body',
    };

    for (const key of Object.keys(columnByKey) as (keyof NewNote)[]) {
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

    fields.push('updated_at = now()');
    values.push(id);

    try {
        const result = await pool.query<NoteRow>(
            `UPDATE notes SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
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

        response.json(toNote(result.rows[0]));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.delete('/notes/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query('DELETE FROM notes WHERE id = $1', [id]);

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
