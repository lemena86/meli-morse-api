import request from 'supertest'
import app from '../api/app'

describe('Url invalid', function () {
    it('Returns 404 status', function (done) {
        request(app)
            .post('/qq')
            .expect(404, done);
    });
});
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
    it('Returns 200 status and valid value with more than one word', function (done) {
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

describe('Translate text to morse', function () {
    it('Returns 422 status code if param "text" is missing', function (done) {
        request(app)
            .post('/translate/2morse')
            .expect(422, done);
    });
    it('Returns 400 status code if param "text" have a character different from letter (A-Z) or a number(0,9)', function (done) {
        request(app)
            .post('/translate/2morse')
            .send({text: 'HOLA MERCADO, LIBRE'})
            .expect(400, done);
    });
    it('Returns 200 status code and JSON format', function (done) {
        request(app)
            .post('/translate/2morse')
            .send({text: 'Donec condimentum fermentum tellus'})
            .expect(200)
            .expect('Content-Type', /json/, done);
    });
    it('Returns 200 status and valid value with more than one word', function (done) {
        request(app)
            .post('/translate/2morse')
            .send({text: 'fermentum tellus'})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('{"code":200,"response":"..-. . .-. -- . -. - ..- --  - . .-.. .-.. ..- ..."}', done);
    });
    it('Returns 200 status and valid value with one word', function (done) {
        request(app)
            .post('/translate/2morse')
            .send({text: 'fermentus'})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('{"code":200,"response":"..-. . .-. -- . -. - ..- ..."}', done);
    });
});

describe('Translate morse to bits', function () {
    it('Returns 422 status code if param "text" is missing', function (done) {
        request(app)
            .post('/translate/2bits')
            .expect(422, done);
    });
    it('Returns 400 status code if param "text" have a character different from . or -', function (done) {
        request(app)
            .post('/translate/2bits')
            .send({text: '.... --- .-.. .H  -- . .-.. ..'})
            .expect(400, done);
    });
    it('Returns 200 status code and JSON format', function (done) {
        request(app)
            .post('/translate/2bits')
            .send({text: '.... --- .-.. .-  -- . .-.. ..'})
            .expect(200)
            .expect('Content-Type', /json/, done);
    });
    it('Returns 200 status and valid value', function (done) {
        request(app)
            .post('/translate/2bits')
            .send({text: '- . ... -  - . -.-. -. .. -.-. ---  -- . .-.. ..'})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('{"code":200,"response":"1100100101010011000110010011010110100110100101001101011010011011011000110110010010110101001010"}', done);
    });
});


describe('Translate bits to morse', function () {
    it('Returns 422 status code if param "text" is missing', function (done) {
        request(app)
            .post('/translate/bits2morse')
            .expect(422, done);
    });
    it('Returns 400 status code if param "text" have a character different from 0 or 1', function (done) {
        request(app)
            .post('/translate/bits2morse')
            .send({text: '0100001L0010'})
            .expect(400, done);
    });
    it('Returns 200 status code and JSON format', function (done) {
        request(app)
            .post('/translate/bits2morse')
            .send({text: '11011011011'})
            .expect(200)
            .expect('Content-Type', /json/, done);
    });
    it('Returns 200 status and valid value', function (done) {
        request(app)
            .post('/translate/bits2morse')
            .send({text: '10111011101110111000101011101110111'})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('{"code":200,"response":".---- ..---"}', done);
    });
});