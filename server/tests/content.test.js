const request = require('supertest');
const app = require('../server'); // Path to your server file

// Mock session middleware for testing
jest.mock('../middleware/authSession', () => jest.fn((req, res, next) => {
  req.session = {
    user: {
      userType: 'school',
      schoolId: '60c72b2f9b1d4c1f884f34d5', // Example school ID
    }
  };
  next();
}));

// Test POST /api/content
describe('POST /api/content', () => {
  it('should upload a new content successfully', async () => {
    const response = await request(app)
      .post('/api/content')
      .field('title', 'Test Content')
      .field('subject', 'Math')
      .field('class', '10')
      .attach('file', '__tests__/files/test-file.pdf');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('title', 'Test Content');
  });
});

// Test GET /api/content
describe('GET /api/content', () => {
  it('should return a list of contents', async () => {
    const response = await request(app).get('/api/content');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
