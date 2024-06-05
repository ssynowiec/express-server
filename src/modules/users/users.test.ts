import request from 'supertest';
import app from '../../app';

let server: any;

beforeAll(() => {
  server = app.listen();
});

afterAll((done) => {
  server.close(done);
});

describe('GET /api/users', () => {
  it('should return all events', async () => {
    return request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});
