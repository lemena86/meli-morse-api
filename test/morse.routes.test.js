import request from 'supertest'
import app from '../api/app'

describe('Translate morse to text', function () {
    it('Returns 422 status code if param "text" is missing', function (done) {
        request(app)
            .post('/translate/2text')
            .expect(422, done);
    });
    it('Returns 400 status code if param "text" have a character different from . or -', function (done) {
        request(app)
            .post('/translate/2text')
            .send({text: '.... ---B .-.. .-  -- . .-.. ..'})
            .expect(400, done);
    });
    it('Returns 200 status code and JSON format', function (done) {
        request(app)
            .post('/translate/2text')
            .send({text: '.... --- .-.. .-  -- . .-.. ..'})
            .expect(200)
            .expect('Content-Type', /json/, done);
    });
    it('Returns 200 status and valid value with two words', function (done) {
        request(app)
            .post('/translate/2text')
            .send({text: '.... --- .-.. .-  -- . .-.. ..'})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('{"code":200,"response":"HOLA MELI"}', done);
    });
    it('Returns 200 status and valid value with one word', function (done) {
        request(app)
            .post('/translate/2text')
            .send({text: '.... --- .-.. .-'})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('{"code":200,"response":"HOLA"}', done);
    });
});