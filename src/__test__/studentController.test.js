import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

const mockService = {
    addStudent: jest.fn(),
    findStudent: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
    addScore: jest.fn(),
    findByName: jest.fn(),
    countByNames: jest.fn(),
    findByMinScore: jest.fn(),
};

// ✅ Mock service module
jest.unstable_mockModule('../services/studentService.js', () => ({
    ...mockService
}));

// ✅ Dynamically import controller and service after mocking
const controller = await import('../controller/studentController.js');
const service = await import('../services/studentService.js');

// ✅ Set up Express app
const app = express();
app.use(express.json());

app.post('/students', controller.addStudent);
app.get('/students/:id', controller.findStudent);
app.put('/students/:id', controller.updateStudent);
app.delete('/students/:id', controller.deleteStudent);
app.patch('/students/:id/scores', controller.addScore);
app.get('/students/name/:name', controller.findByName);
app.get('/students/count/by-names', controller.countByNames);
app.get('/students/min-score/:exam/:minScore', controller.findByMinScore);

describe('Student Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /students', () => {
        it('should return 201 if student is created', async () => {
            service.addStudent.mockResolvedValue(true);

            const res = await request(app)
                .post('/students')
                .send({ id: 1, name: 'Alice', password: '1234' });

            expect(res.statusCode).toBe(201);
        });

        it('should return 409 if student already exists', async () => {
            service.addStudent.mockResolvedValue(false);

            const res = await request(app)
                .post('/students')
                .send({ id: 1, name: 'Alice', password: '1234' });

            expect(res.statusCode).toBe(409);
        });

        it('should return 400 if validation fails', async () => {
            const res = await request(app)
                .post('/students')
                .send({ name: 'Alice' }); // missing password & _id

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /students/:id', () => {
        it('should return student if found', async () => {
            service.findStudent.mockResolvedValue({ _id: 1, name: 'Alice' });

            const res = await request(app).get('/students/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ _id: 1, name: 'Alice' });
        });

        it('should return 404 if not found', async () => {
            service.findStudent.mockResolvedValue(null);

            const res = await request(app).get('/students/999');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PUT /students/:id', () => {
        it('should update and return student', async () => {
            service.updateStudent.mockResolvedValue({ _id: 1, name: 'Bob' });

            const res = await request(app)
                .put('/students/1')
                .send({ name: 'Bob' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ _id: 1, name: 'Bob' });
        });

        it('should return 404 if not found', async () => {
            service.updateStudent.mockResolvedValue(null);

            const res = await request(app)
                .put('/students/1')
                .send({ name: 'Bob' });

            expect(res.statusCode).toBe(404);
        });

        it('should return 400 for invalid input', async () => {
            const res = await request(app)
                .put('/students/1')
                .send({ wrongField: 'oops' });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('DELETE /students/:id', () => {
        it('should delete and return student', async () => {
            service.deleteStudent.mockResolvedValue({ _id: 1, name: 'Alice' });

            const res = await request(app).delete('/students/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ _id: 1, name: 'Alice' });
        });

        it('should return 404 if student not found', async () => {
            service.deleteStudent.mockResolvedValue(null);

            const res = await request(app).delete('/students/999');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PATCH /students/:id/scores', () => {
        it('should update score and return 204', async () => {
            service.addScore.mockResolvedValue(true);

            const res = await request(app)
                .patch('/students/1/scores')
                .send({ examName: 'math', score: 90 });

            expect(res.statusCode).toBe(204);
        });

        it('should return 400 if validation fails', async () => {
            const res = await request(app)
                .patch('/students/1/scores')
                .send({ exam: 'math' }); // missing fields

            expect(res.statusCode).toBe(400);
        });

        it('should return 409 if update fails', async () => {
            service.addScore.mockResolvedValue(false);

            const res = await request(app)
                .patch('/students/1/scores')
                .send({ examName: 'math', score: 90 });

            expect(res.statusCode).toBe(409);
        });
    });

    describe('GET /students/name/:name', () => {
        it('should return students by name', async () => {
            service.findByName.mockResolvedValue([{ _id: 1, name: 'Alice' }]);

            const res = await request(app).get('/students/name/Alice');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([{ _id: 1, name: 'Alice' }]);
        });
    });

    describe('GET /students/count/by-names', () => {
        it('should return count of students by names', async () => {
            service.countByNames.mockResolvedValue(2);

            const res = await request(app).get('/students/count/by-names?names=Alice&names=Bob');

            expect(res.statusCode).toBe(200);
            expect(res.body).toBe(2);
        });
    });

    describe('GET /students/min-score/:exam/:minScore', () => {
        it('should return students by minimum score', async () => {
            service.findByMinScore.mockResolvedValue([
                { _id: 1, name: 'Alice' },
                { _id: 2, name: 'Bob' }
            ]);

            const res = await request(app).get('/students/min-score/math/80');

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });
});
