import { Router } from 'express';
import pool from '../db';
import { NewNote, NoteRow, toNote } from '../types';

const router = Router();

router.get('/notes', async (request, response) => {
    try {
        const result = await pool.query<NoteRow>('SELECT * FROM notes ORDER BY created_at DESC');
        response.json(result.rows.map(toNote));
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.post('/notes', async (request, response) => {
    const note = request.body as NewNote;
    if (!note.title || !note.body) {
        response.status(400).send('Bad Request');
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
        response.status(500).send('Internal Server Error');
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
        response.status(400).send('Bad Request');
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
            response.status(404).send('Not Found');
            return;
        }

        response.json(toNote(result.rows[0]));
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.delete('/notes/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query('DELETE FROM notes WHERE id = $1', [id]);

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

export default router;
