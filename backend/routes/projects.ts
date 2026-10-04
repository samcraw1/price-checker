import { Router } from 'express';
import pool from '../db';
import { NewProject, ProjectRow, toProject } from '../types';
import { ErrorCodeForDebugging } from '../types';

const router = Router();

router.get('/projects', async (request, response) => {
    try {
        const result = await pool.query<ProjectRow>('SELECT * FROM projects ORDER BY id DESC');
        response.json(result.rows.map(toProject));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.post('/projects', async (request, response) => {
    const project = request.body as NewProject;
    if (!project.title || !project.description || !project.technologies || !project.status) {
        const body: ErrorCodeForDebugging = {
            code: 400,
            message: 'Bad Request'
        };
        response.status(body.code).json(body);
        return;
    }

    try {
        const result = await pool.query<ProjectRow>(
            'INSERT INTO projects (title, description, technologies, status, repository, deployment_url, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [
                project.title,
                project.description,
                project.technologies,
                project.status,
                project.repository ?? null,
                project.deploymentUrl ?? null,
                project.notes ?? null,
            ]
        );
        response.status(201).json(toProject(result.rows[0]));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.put('/projects/:id', async (request, response) => {
    const { id } = request.params;
    const updates = request.body as Partial<NewProject>;

    const fields: string[] = [];
    const values: unknown[] = [];
    const columnByKey: Record<keyof NewProject, string> = {
        title: 'title',
        description: 'description',
        technologies: 'technologies',
        status: 'status',
        repository: 'repository',
        deploymentUrl: 'deployment_url',
        notes: 'notes',
    };

    for (const key of Object.keys(columnByKey) as (keyof NewProject)[]) {
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
        const result = await pool.query<ProjectRow>(
            `UPDATE projects SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
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

        response.json(toProject(result.rows[0]));
    } catch (error) {
        console.error(error);
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Internal Server Error'
        };
        response.status(body.code).json(body);
    }
});

router.delete('/projects/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);

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
