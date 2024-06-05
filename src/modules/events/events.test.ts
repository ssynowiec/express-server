import request from 'supertest';
import app from '../../app';

let server: any;

let eventId = '';

beforeAll(() => {
  server = app.listen();
});

afterAll((done) => {
  server.close(done);
});

describe('GET /api/events', () => {
  it('should return all events', async () => {
    return request(app)
      .get('/api/events')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

describe('POST /api/event', () => {
  it('should create new event', async () => {
    return request(app)
      .post('/api/event')
      .send({
        name: 'Test event',
        description: 'Test description',
        question: 'Test question',
        answers: [{ answer: 'Test answer' }, { answer: 'Test answer' }],
        status: 'draft',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        eventId = res.body.id;
      });
  });
});

describe('GET /api/event/:id', () => {
  it('should return event by id', async () => {
    return request(app)
      .get(`/api/event/${eventId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

describe(`GET /api/start-event/${eventId}`, () => {
  it('should start event', async () => {
    return request(app)
      .get(`/api/start-event/${eventId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.progress).toBe('in-progress');
        expect(res.body.eventCode).not.toBe('');
      });
  });
});
