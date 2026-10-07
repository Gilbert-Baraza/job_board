import request from 'supertest'
import app from '../app'
import { createTestToken } from './helper/auth';


describe("post /users",()=>{
    test('Should login user', async ()=>{
        const response = await request(app)
        .post('/users/login')
        .send({
            "email":"admin@mail.com",
            "password":"40807663"
        });
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('token')
    })
});

describe("Get /users/jobs",()=>{
    const token = createTestToken({
        id: "6dd53354-c549-4704-8437-a17be6a2e40b",
        role: "user"
    })
    test('Should return jobs', async ()=>{
        const response = await request(app)
        .get('/users/jobs')
        .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        
    })
});



