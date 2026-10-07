import request from 'supertest'
import app from '../app'
import { createTestToken } from './helper/auth';


test('should reject requests without authentication', async () => {
    const response = await request(app)
        .get('/applications/me');

    expect(response.statusCode).toBe(401);
});