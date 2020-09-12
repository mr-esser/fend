/* Integration test cases.

   Thanks to Robert Gao for his blog post on setting up the tests.
   See https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/.

   Note(!): Tests will consume API credits. Do run only when necessary!
            Must call return to have tests exit cleanly!
            Keep an eye on issue https://github.com/visionmedia/supertest/issues/437.
            dealing with problems when shutting down the server after the tests.
*/

const request = require('supertest');
const app = require('../../../src/server/js/app');

test('GET / should yield 200', () => {
  return/* ! */ request(app)
      .get('/')
      .expect(200);
});

describe('Testing POST /analysis', () => {
  test('with inaccessible document URL should return 500', () => {
    return/* ! */ request(app).post('/analysis')
        .set('Content-Type', 'application/json')
        .send({url: 'doh'}).expect(500);
  });

  test('with accessible document URL should return 200 and a result', () => {
    const documentUrl = 'https://www.google.com';
    return/* ! */ request(app).post('/analysis')
        .set('Content-Type', 'application/json')
        .send({url: documentUrl})
        .expect(200)
        .expect('Content-Type', /json/)
        .expect( (res) => {
          expect(res.body).toMatchObject( {
            confidence: expect.anything(),
            irony: expect.anything(),
            polarity: expect.anything(),
            subjectivity: expect.anything(),
            targetUrl: documentUrl,
          });
        });
  });
});
