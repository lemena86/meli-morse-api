'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _clientErrors = require('../errors/client-errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var MorseService = {
    /**
     * Given a string in morse code translates it into binary code (0,1), you must specify the amount of 1 for the points (.) and
     * for the lines (-), zeros when it is separation of morse characters, separation of letters and separation of words
     *
     * @param morse       morse string
     * @param minOnes     the amount of ones for the point (.)
     * @param maxOnes     the amount of ones for the line(-)
     * @param minZeros    the amount of zeros to separate characters from the same letter
     * @param mediumZeros the amount of zeros to separate letters
     * @param maxZeros    the amount of zeros to separate words
     * @return {string} string with the text in bits
     */
    encodeMorse2Bits: function encodeMorse2Bits(morse) {
        var minOnes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var maxOnes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
        var minZeros = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var mediumZeros = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var maxZeros = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 2;

        var _concat = function _concat(count, character) {
            var response = '';
            for (var i = 0; i < count; i++) {
                response = response.concat(character);
            }
            return response;
        };
        var response = "";
        var length = morse.length;
        for (var i = 0; i < length; i++) {
            if (morse.charAt(i) === '.') {
                //placing the 1
                response = response.concat(_concat(minOnes, '1'));

                //placing space to separate characters
                response = response.concat(_concat(minZeros, '0'));
            } else if (morse.charAt(i) === '-') {
                //placing the 1
                response = response.concat(_concat(maxOnes, '1'));

                //placing space to separate characters
                response = response.concat(_concat(minZeros, '0'));
            } else if (morse.charAt(i) === ' ') {
                //find the number of spaces to know if they are 1 or 2 spaces
                if (morse.charAt(i + 1) === ' ') {
                    //is separation of words
                    i++;
                    response = response.concat(_concat(maxZeros, '0'));
                } else {
                    //letter separation
                    response = response.concat(_concat(mediumZeros, '0'));
                }
            } else {
                throw new _clientErrors.MalformedMorseStringError('Character not in morse', {
                    'msg': 'Character not in morse',
                    'character': morse.charAt(i)
                });
            }
        }
        return response;
    },
    /**
     * Given a string in bits it returns the decoded string in morse
     *
     * @param bits string in bits
     * @returns {string} morse decoded string
     */
    decodeBits2Morse: function decodeBits2Morse(bits) {
        //first and last ocurrence of 1
        var start = bits.indexOf('1'),
            end = bits.lastIndexOf('1') + 1;
        if (start === -1) throw new _clientErrors.MalformedBitsStringError('Bit 1 not found in string', { 'msg': 'Bit 1 not found in string' });

        //find count of consecutive characters
        var _getCount = function _getCount(character, start, end) {
            var j = start,
                count = 0;
            while (j < end && bits.charAt(j) === character) {
                count++;
                j++;
            }
            return { 'count': count, 'j': j };
        };

        //search ocurrences of zeros and ones
        var getCountResult = void 0;
        var setOnes = new Set();
        var setZeros = new Set();
        for (var i = start; i < end;) {
            //search ocurrence of 1
            if (bits.charAt(i) === '1') {
                getCountResult = _getCount(bits.charAt(i), i, end);
                setOnes.add(getCountResult['count']);
                i = getCountResult['j'];
            }
            //search ocurrence of 0
            else if (bits.charAt(i) === '0') {
                    getCountResult = _getCount(bits.charAt(i), i, end);
                    setZeros.add(getCountResult['count']);
                    i = getCountResult['j'];
                } else {
                    throw new _clientErrors.MalformedBitsStringError('Character not a bit', {
                        'msg': 'Character not a bit',
                        'character': bits.charAt(i)
                    });
                }
        }
        //verify sets
        if (setOnes.size > 2) throw new _clientErrors.MalformedBitsStringError('More than two ones in a row in the string (e.g 10110111)', { 'msg': 'More than two ones in a row in the string (e.g 10110111)' });
        //para los zeros el maximo es 3
        if (setZeros.size > 3) throw new _clientErrors.MalformedBitsStringError('More than three zeros in a row in the string (e.g 10110010001000010)', { 'msg': 'More than three zeros in a row in the string (e.g 10110010001000010)' });

        //order setOnes and Zeros
        var ones = _lodash2.default.sortBy([].concat(_toConsumableArray(setOnes)));
        var zeros = _lodash2.default.sortBy([].concat(_toConsumableArray(setZeros)));

        //ones map with for the dots(.) and the dash(-)
        var mapOnes = new Map();
        mapOnes.set(ones[0], '.');
        if (ones[1]) mapOnes.set(ones[1], '-');

        //zeros map for spaces
        var mapZeros = new Map();
        if (zeros[0]) mapZeros.set(zeros[0], '');
        if (zeros[1]) mapZeros.set(zeros[1], ' ');
        if (zeros[2]) mapZeros.set(zeros[2], '  ');

        //loop bits to find dot, dash, pause or long pause
        var response = '';
        for (var _i = start; _i < end;) {
            //search one
            if (bits.charAt(_i) === '1') {
                getCountResult = _getCount(bits.charAt(_i), _i, end);
                _i = getCountResult['j'];
                response = response.concat(mapOnes.get(getCountResult['count']));
            }
            //search zero
            else {
                    getCountResult = _getCount(bits.charAt(_i), _i, end);
                    _i = getCountResult['j'];
                    response = response.concat(mapZeros.get(getCountResult['count']));
                }
        }
        return response;
    },
    /**
     * Given a morse code it returns its equivalent in alphanumeric text
     *
     * @param morse string in morse code
     * @returns {string} string in alphanumeric text
     */
    translate2Human: function translate2Human(morse) {
        var response = '',
            letter = void 0,
            length = morse.length,
            j = void 0,
            count = void 0,
            human = void 0;
        for (var i = 0; i < length;) {
            if (morse.charAt(i) === ' ') {
                j = i;
                count = 0;
                while (j < length && morse.charAt(j) === ' ') {
                    j++;
                    count++;
                }
                if (count > 1) response = response.concat(" ");
            } else if (morse.charAt(i) === '.' || morse.charAt(i) === '-') {
                letter = '';
                j = i;
                while (j < length && morse.charAt(j) !== ' ') {
                    letter = letter.concat(morse.charAt(j));
                    j++;
                }
                human = morseMap.get(letter);
                if (!_lodash2.default.isUndefined(human)) response = response.concat(human);else throw new _clientErrors.MalformedMorseStringError('Morse letter not valid', { 'msg': 'Morse letter not valid', 'letter': letter });
            } else {
                throw new _clientErrors.MalformedMorseStringError('Character not in morse', { 'msg': 'Character not in morse', 'character': morse.charAt(i) });
            }
            i = j;
        }
        return response;
    },

    /**
     * Given a phrase in alphanumerical returns its corresponding in Morse code
     *
     * @param human alphanumerical phrase
     * @returns {string} morse code
     */
    encode2Morse: function encode2Morse(human) {
        human = human.toUpperCase();
        var response = '',
            length = human.length,
            j = void 0,
            morse = void 0;
        for (var i = 0; i < length;) {
            if (human.charAt(i) === ' ') {
                j = i;
                while (j < length && human.charAt(j) === ' ') {
                    j++;
                }i = j;
            } else {
                morse = alphaMap.get(human.charAt(i));
                if (!_lodash2.default.isUndefined(morse)) response = response.concat(morse);else throw new _clientErrors.MalformedAlphaNumericStringError('AlphaNumeric not valid', { 'msg': 'AlphaNumeric not valid', 'character': human.charAt(i) });
                i++;
            }
            if (i < length) response = response.concat(' ');
        }
        return response;
    }

};
var alphaMap = new Map([['A', ".-"], ['B', "-..."], ['C', "-.-."], ['D', "-.."], ['E', "."], ['F', "..-."], ['G', "--."], ['H', "...."], ['I', ".."], ['J', ".---"], ['K', "-.-"], ['L', ".-.."], ['M', "--"], ['N', "-."], ['O', "---"], ['P', ".--."], ['Q', "--.-"], ['R', ".-."], ['S', "..."], ['T', "-"], ['U', "..-"], ['V', "...-"], ['W', ".--"], ['X', "-..-"], ['Y', "-.--"], ['Z', "--.."], ['0', "-----"], ['1', ".----"], ['2', "..---"], ['3', "...--"], ['4', "....-"], ['5', "....."], ['6', "-...."], ['7', "--..."], ['8', "---.."], ['9', "----."]]);

var morseMap = new Map([[".-", 'A'], ["-...", 'B'], ["-.-.", 'C'], ["-..", 'D'], [".", 'E'], ["..-.", 'F'], ["--.", 'G'], ["....", 'H'], ["..", 'I'], [".---", 'J'], ["-.-", 'K'], [".-..", 'L'], ["--", 'M'], ["-.", 'N'], ["---", 'O'], [".--.", 'P'], ["--.-", 'Q'], [".-.", 'R'], ["...", 'S'], ["-", 'T'], ["..-", 'U'], ["...-", 'V'], [".--", 'W'], ["-..-", 'X'], ["-.--", 'Y'], ["--..", 'Z'], ["-----", '0'], [".----", '1'], ["..---", '2'], ["...--", '3'], ["....-", '4'], [".....", '5'], ["-....", '6'], ["--...", '7'], ["---..", '8'], ["----.", '9']]);

exports.default = MorseService;