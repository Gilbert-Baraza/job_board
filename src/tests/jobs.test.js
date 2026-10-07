import request from 'supertest'
import app from '../app'
import { createTestToken } from './helper/auth';

describe('GET /jobs', () => {
    
    test('should return jobs', async () => {
        const response = await request(app)
            .get('/jobs');
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
    });
});
describe('POST /jobs', () => {
    const token = createTestToken({
        id:"6dd53354-c549-4704-8437-a17be6a2e40b",
        role: 'user'
    })
    test('should post jobs', async () => {
        const response = await request(app)
            .post('/jobs')
            .send({
                title: 'Software Developer',
                description: 'Build backend APIs',
                location: 'Busia',
                salary: 60000
            })
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
    });
});
