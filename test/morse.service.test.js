import {assert} from 'chai';
import _ from 'lodash';
import {
    MalformedMorseStringError,
    MalformedBitsStringError,
    MalformedAlphaNumericStringError
} from '../api/errors/client-errors'

import MorseService from '../api/services/morse.service'


describe('Testing encodeMorse2Bits function', function () {
    it('encodeMorse2Bits is a function', function () {
        assert.isFunction(MorseService.encodeMorse2Bits);
    });
    it('Throws and error if have a character different from . or -', function () {
        const morse = '.-.-q.';
        assert.throws(() => MorseService.encodeMorse2Bits(morse), MalformedMorseStringError, 'Character not in morse');
    });
    it('Return an string', function () {
        const morse = '.-.-  - -.-.';
        assert.isString(MorseService.encodeMorse2Bits(morse));
    });
    it('Is ok with differents test values', function () {
        const morse = '- . ... -  - . -.-. -. .. -.-. ---  -- . .-.. ..';
        //first case
        const result = '1100100101010011000110010011010110100110100101001101011010011011011000110110010010110101001010';
        assert.strictEqual(MorseService.encodeMorse2Bits(morse, 1, 2, 1, 1, 2), result);
        //second case
        const result1 = '1111111100111110011111011111011111001111111100000011111111001111100111111110111110111111110111110011111111011111001111101111100111111110111110111111110111110011111111011111111011111111000000111111110111111110011111001111101111111101111101111100111110111110';
        assert.strictEqual(MorseService.encodeMorse2Bits(morse, 5, 8, 1, 1, 5), result1);
    });
});

describe('Testing decodeBits2Morse function', function () {
    it('encodeMorse2Bits is a function', function () {
        assert.isFunction(MorseService.decodeBits2Morse);
    });
    it('Throws and error if not found any ocurrence of 1', function () {
        const bits = '000000000';
        assert.throws(() => MorseService.decodeBits2Morse(bits), MalformedBitsStringError, 'Bit 1 not found in string');
    });
    it('Throws and error if have a character different from 0 or 1', function () {
        const bits = '010000c0010';
        assert.throws(() => MorseService.decodeBits2Morse(bits), MalformedBitsStringError, 'Character not a bit');
    });
    it('Throws and error if have more than two ones in a row', function () {
        const bits = '10110111';
        assert.throws(() => MorseService.decodeBits2Morse(bits), MalformedBitsStringError, 'More than two ones in a row in the string (e.g 10110111)');
    });
    it('Throws and error if have more than three zeros in a row', function () {
        const bits = '10110011000100001';
        assert.throws(() => MorseService.decodeBits2Morse(bits), MalformedBitsStringError, 'More than three zeros in a row in the string (e.g 10110010001000010)');
    });
    it('Return an string', function () {
        const bits = '000000100';
        assert.isString(MorseService.decodeBits2Morse(bits));
    });
    it('Is ok with 1000 tests cases, more than one word', function () {
        let originalMorse = '- . ... -  - . -.-. -. .. -.-. ---  -- . .-.. ..';
        for (let i = 0; i < 1000; i++) {
            let minOnes = _.random(1, 10);
            let maxOnes = _.random(minOnes + 1, 20);
            let minZeros = _.random(1, 10);
            let mediumZeros = _.random(minZeros, 20);
            let maxZeros = _.random(mediumZeros + 1, 30);
            let morse = "- . ... -  - . -.-. -. .. -.-. ---  -- . .-.. ..";
            let inBits = MorseService.encodeMorse2Bits(morse, minOnes, maxOnes, minZeros, mediumZeros, maxZeros);
            assert.strictEqual(MorseService.decodeBits2Morse(inBits), originalMorse);
        }
    });
    it('Is ok with 1000 tests cases, only one word', function () {
        let originalMorse = '- . ... -';
        for (let i = 0; i < 1000; i++) {
            let minOnes = _.random(1, 10);
            let maxOnes = _.random(minOnes + 1, 20);
            let minZeros = _.random(1, 10);
            let mediumZeros = _.random(minZeros, 20);
            let maxZeros = _.random(mediumZeros + 1, 30);
            let morse = "- . ... -";
            let inBits = MorseService.encodeMorse2Bits(morse, minOnes, maxOnes, minZeros, mediumZeros, maxZeros);
            assert.strictEqual(MorseService.decodeBits2Morse(inBits), originalMorse);
        }
    });
});

describe('Testing translate2Human function', function () {
    it('translate2Human is a function', function () {
        assert.isFunction(MorseService.translate2Human);
    });
    it('Throws and error if have a character different from . or -', function () {
        const morse = '.... q -';
        assert.throws(() => MorseService.translate2Human(morse), MalformedMorseStringError, 'Character not in morse');
    });
    it('Throws and error if the morse code is not valid', function () {
        const morse = '......';
        assert.throws(() => MorseService.translate2Human(morse), MalformedMorseStringError, 'Morse letter not valid');
    });
    it('Return an string', function () {
        const morse = '.... --- .-.. .-  -- . .-.. ..';
        assert.isString(MorseService.translate2Human(morse));
    });
    it('Is ok with differents test values', function () {
        let morse = '.... --- .-.. .-  -- . .-.. ..';
        let human = 'HOLA MELI';
        //first case
        assert.strictEqual(MorseService.translate2Human(morse), human);

        //second case
        morse = '- . ... -  - . -.-. -. .. -.-. ---  -- . .-.. ..';
        human = 'TEST TECNICO MELI';
        assert.strictEqual(MorseService.translate2Human(morse), human);

        //third case
        morse = '.-.. --- .-. . --  .. .--. ... ..- --  -.. --- .-.. --- .-.  ... .. -  .- -- . -  -.-. --- -. ... . -.-. - . - ..- .-.  .- -.. .. .--. .. ... -.-. .. -. --.  . .-.. .. -';
        human = 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISCING ELIT';
        assert.strictEqual(MorseService.translate2Human(morse), human);
    });
});

describe('Testing encode2Morse function', function () {
    it('encode2Morse is a function', function () {
        assert.isFunction(MorseService.encode2Morse);
    });
    it('Throws and error if have a character different from a letter (A-Z) or a number(0,9)', function () {
        const human = 'TEST TECNICO, MELI';
        assert.throws(() => MorseService.encode2Morse(human), MalformedAlphaNumericStringError, 'AlphaNumeric not valid');
    });
    it('Return an string', function () {
        const human = 'TEST TECNICO MELI';
        assert.isString(MorseService.encode2Morse(human));
    });

    it('Is ok with differents test values', function () {

        let morse = '.... --- .-.. .-  -- . .-.. ..';
        let human = 'HOLA MELI';
        //first case
        assert.strictEqual(MorseService.encode2Morse(human), morse);

        //second case
        morse = '- . ... -  - . -.-. -. .. -.-. ---  -- . .-.. ..';
        human = 'TEST TECNICO MELI';
        assert.strictEqual(MorseService.encode2Morse(human), morse);

        //third case
        morse = '.-.. --- .-. . --  .. .--. ... ..- --  -.. --- .-.. --- .-.  ... .. -  .- -- . -  -.-. --- -. ... . -.-. - . - ..- .-.  .- -.. .. .--. .. ... -.-. .. -. --.  . .-.. .. -';
        human = 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISCING ELIT';
        assert.strictEqual(MorseService.encode2Morse(human), morse);
    });
});

describe('Testing all together', function () {
    it('With a human phrase, convert to morse, then convert to bits in two ways, again to morse and finally to human', function () {
        const human = 'Praesent sodales libero at orci vestibulum sit amet vehicula dui dapibus';
        //convert the human text to morse
        const toMorse = MorseService.encode2Morse(human);
        //convert from morse to bits in two ways
        const toBits1 = MorseService.encodeMorse2Bits(toMorse);
        const toBits2 = MorseService.encodeMorse2Bits(toMorse, 3, 6, 3, 4, 6);
        //convert from bits to morse
        const toMorse1 = MorseService.decodeBits2Morse(toBits1);
        const toMorse2 = MorseService.decodeBits2Morse(toBits2);
        //convert the two morses to human
        const human1 = MorseService.translate2Human(toMorse1);
        const human2 = MorseService.translate2Human(toMorse2);
        //verify if the first human in uppercase is equal two the human1 and human2
        assert.strictEqual(human.toUpperCase(), human1);
        assert.strictEqual(human.toUpperCase(), human2);

    });
});