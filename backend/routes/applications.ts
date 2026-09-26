import { Router } from 'express';
import pool from '../db';
import { NewApplication, ApplicationRow, toApplication } from '../types';

const router = Router();

router.get('/applications', async (request, response) => {
    try {
        const result = await pool.query<ApplicationRow>('SELECT * FROM applications ORDER BY date_applied DESC');
        response.json(result.rows.map(toApplication));
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.post('/applications', async (request, response) => {
    const application = request.body as NewApplication;
    if (!application.company || !application.role || !application.status || !application.dateApplied) {
        response.status(400).send('Bad Request');
        return;
    }

    try {
        const result = await pool.query<ApplicationRow>(
            'INSERT INTO applications (company, role, status, date_applied, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [application.company, application.role, application.status, application.dateApplied, application.notes ?? null]
        );
        response.status(201).json(toApplication(result.rows[0]));
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.put('/applications/:id', async (request, response) => {
    const { id } = request.params;
    const updates = request.body as Partial<NewApplication>;

    const fields: string[] = [];
    const values: unknown[] = [];
    const columnByKey: Record<keyof NewApplication, string> = {
        company: 'company',
        role: 'role',
        status: 'status',
        dateApplied: 'date_applied',
        notes: 'notes',
    };

    for (const key of Object.keys(columnByKey) as (keyof NewApplication)[]) {
        if (updates[key] !== undefined) {
            values.push(updates[key]);
            fields.push(`${columnByKey[key]} = $${values.length}`);
        }
    }

    if (fields.length === 0) {
        response.status(400).send('Bad Request');
        return;
    }

    fields.push('last_updated = now()');
    values.push(id);

    try {
        const result = await pool.query<ApplicationRow>(
            `UPDATE applications SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            response.status(404).send('Not Found');
            return;
        }

        response.json(toApplication(result.rows[0]));
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.delete('/applications/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query('DELETE FROM applications WHERE id = $1', [id]);

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
