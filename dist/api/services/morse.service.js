'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _clientErrors = require('../errors/client-errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var DOT = '.';
var DASH = '-';
var ONE_SPACE = ' ';
var TWO_SPACES = '  ';
var ZERO = '0';
var ONE = '1';
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

        //validation minOnes and maxOnes
        if (minOnes >= maxOnes) {
            throw new _clientErrors.MorseToBitsValidationError('maxOnes must be greater than minOnes', {
                'msg': 'maxOnes must be greater than minOnes',
                'minOnes': minOnes,
                'maxOnes': maxOnes
            });
        }
        //validating minZeros, mediumZeros, maxZeros
        if (minZeros > mediumZeros || minZeros >= maxZeros || mediumZeros >= maxZeros) {
            throw new _clientErrors.MorseToBitsValidationError('minZeros must be less or equal than mediumZeros, mediumZeros must be less than maxZeros', {
                'msg': 'minZeros must be less or equal than mediumZeros, mediumZeros must be less than maxZeros',
                'minZeros': minZeros,
                'mediumZeros': mediumZeros,
                'maxZeros': maxZeros
            });
        }
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
            if (morse.charAt(i) === DOT) {
                //placing the 1
                response = response.concat(_concat(minOnes, ONE));

                //placing space to separate characters
                response = response.concat(_concat(minZeros, ZERO));
            } else if (morse.charAt(i) === DASH) {
                //placing the 1
                response = response.concat(_concat(maxOnes, ONE));

                //placing space to separate characters
                response = response.concat(_concat(minZeros, ZERO));
            } else if (morse.charAt(i) === ONE_SPACE) {
                if (i + 1 < length) {
                    //find the number of spaces to know if they are 1 or 2 spaces
                    if (morse.charAt(i + 1) === ONE_SPACE) {
                        //is separation of words
                        i++;
                        response = response.concat(_concat(maxZeros, ZERO));
                    } else {
                        //letter separation
                        response = response.concat(_concat(mediumZeros, ZERO));
                    }
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
    decodeBits2MorseMoreComplexity: function decodeBits2MorseMoreComplexity(bits) {
        //first and last ocurrence of 1
        var start = bits.indexOf(ONE),
            end = bits.lastIndexOf(ONE) + 1;
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
        var getCountResult = {};
        var setOnes = new Set();
        var setZeros = new Set();
        var array = [];

        for (var i = start; i < end;) {
            //search ocurrence of 1
            if (bits.charAt(i) === ONE) {
                getCountResult = _getCount(bits.charAt(i), i, end);
                setOnes.add(getCountResult['count']);
                array.push({ 'character': ONE, 'count': getCountResult['count'] });
                i = getCountResult['j'];
            }
            //search ocurrence of 0
            else if (bits.charAt(i) === ZERO) {
                    getCountResult = _getCount(bits.charAt(i), i, end);
                    setZeros.add(getCountResult['count']);
                    array.push({ 'character': ZERO, 'count': getCountResult['count'] });
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
        mapOnes.set(ones[0], DOT);
        if (ones[1]) mapOnes.set(ones[1], DASH);

        //zeros map for spaces
        var mapZeros = new Map();
        if (zeros[0]) mapZeros.set(zeros[0], '');
        if (zeros[1]) mapZeros.set(zeros[1], ONE_SPACE);
        if (zeros[2]) mapZeros.set(zeros[2], TWO_SPACES);

        //loop for array to create the response
        var response = '';
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var obj = _step.value;

                if (obj['character'] === ONE) response = response.concat(mapOnes.get(obj['count']));else response = response.concat(mapZeros.get(obj['count']));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return response;
    },

    decodeBits2Morse: function decodeBits2Morse(bits) {
        //first and last ocurrence of 1
        var start = bits.indexOf(ONE),
            end = bits.lastIndexOf(ONE) + 1;
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
        var getCountResult = {};
        var array = [];
        var minOne = Number.MAX_VALUE,
            maxOne = Number.MIN_VALUE,
            minZero = Number.MAX_VALUE,
            medZero = Number.MAX_VALUE,
            maxZero = Number.MIN_VALUE,
            changesOne = 0,
            changesZeros = 0,
            count = void 0;
        for (var i = start; i < end;) {
            getCountResult = _getCount(bits.charAt(i), i, end);
            count = getCountResult['count'];
            //search ocurrence of 1
            if (bits.charAt(i) === ONE) {
                if (count <= minOne) {
                    //update minOne if is greater than count
                    if (count < minOne) {
                        if (minOne !== Number.MAX_VALUE) maxOne = minOne;
                        minOne = count;
                        changesOne++;
                    }
                } else if (count >= maxOne) {
                    //only update maxOne if is less than count
                    if (count > maxOne) {
                        maxOne = count;
                        changesOne++;
                    }
                } else {
                    throw new _clientErrors.MalformedBitsStringError('More than two ones in a row in the string (e.g 10110111)', { 'msg': 'More than two ones in a row in the string (e.g 10110111)' });
                }
                i = getCountResult['j'];
                array.push({ 'character': ONE, 'count': count });
            }
            //search ocurrence of 0
            else if (bits.charAt(i) === ZERO) {
                    if (count <= minZero) {
                        //update minZero if is greater than count
                        if (count < minZero) {
                            //if (medZero !== Number.MAX_VALUE) maxZero = medZero;
                            if (minZero !== Number.MAX_VALUE) medZero = minZero;
                            minZero = count;
                            changesZeros++;
                        }
                    } else if (count <= medZero) {
                        //update medZero if is greater than count
                        if (count < medZero) {
                            //if (medZero !== Number.MAX_VALUE) maxZero = medZero;
                            medZero = count;
                            changesZeros++;
                        }
                    } else if (count >= maxZero) {
                        //update maxZero if is less than count
                        if (count > maxZero) {
                            maxZero = count;
                            changesZeros++;
                        }
                    } else {
                        throw new _clientErrors.MalformedBitsStringError('More than three zeros in a row in the string (e.g 10110010001000010)', { 'msg': 'More than three zeros in a row in the string (e.g 10110010001000010)' });
                    }
                    i = getCountResult['j']; //i
                    array.push({ 'character': ZERO, 'count': count });
                } else {
                    throw new _clientErrors.MalformedBitsStringError('Character not a bit', {
                        'msg': 'Character not a bit',
                        'character': bits.charAt(i)
                    });
                }
        }
        //verify sets
        if (changesOne > 2) throw new _clientErrors.MalformedBitsStringError('More than two ones in a row in the string (e.g 10110111)', { 'msg': 'More than two ones in a row in the string (e.g 10110111)' });
        //para los zeros el maximo es 3
        if (changesZeros > 3) throw new _clientErrors.MalformedBitsStringError('More than three zeros in a row in the string (e.g 10110010001000010)', { 'msg': 'More than three zeros in a row in the string (e.g 10110010001000010)' });

        //ones map with for the dots(.) and the dash(-)
        var mapOnes = new Map();
        mapOnes.set(minOne, DOT);
        mapOnes.set(maxOne, DASH);

        //zeros map for spaces
        var mapZeros = new Map();
        mapZeros.set(minZero, '');
        mapZeros.set(medZero, ONE_SPACE);
        mapZeros.set(maxZero, TWO_SPACES);

        //loop for array to create the response
        var response = '';
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var obj = _step2.value;

                if (obj['character'] === ONE) response = response.concat(mapOnes.get(obj['count']));else response = response.concat(mapZeros.get(obj['count']));
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
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
            if (morse.charAt(i) === ONE_SPACE) {
                j = i;
                count = 0;
                while (j < length && morse.charAt(j) === ONE_SPACE) {
                    j++;
                    count++;
                }
                if (count > 1) response = response.concat(ONE_SPACE);
            } else if (morse.charAt(i) === DOT || morse.charAt(i) === DASH) {
                letter = '';
                j = i;
                while (j < length && morse.charAt(j) !== ONE_SPACE) {
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
            if (human.charAt(i) === ONE_SPACE) {
                j = i;
                while (j < length && human.charAt(j) === ONE_SPACE) {
                    j++;
                }i = j;
            } else {
                morse = alphaMap.get(human.charAt(i));
                if (!_lodash2.default.isUndefined(morse)) response = response.concat(morse);else throw new _clientErrors.MalformedAlphaNumericStringError('AlphaNumeric not valid', { 'msg': 'AlphaNumeric not valid', 'character': human.charAt(i) });
                i++;
            }
            if (i < length) response = response.concat(ONE_SPACE);
        }
        return response;
    }

};
var alphaMap = new Map([['A', ".-"], ['B', "-..."], ['C', "-.-."], ['D', "-.."], ['E', "."], ['F', "..-."], ['G', "--."], ['H', "...."], ['I', ".."], ['J', ".---"], ['K', "-.-"], ['L', ".-.."], ['M', "--"], ['N', "-."], ['O', "---"], ['P', ".--."], ['Q', "--.-"], ['R', ".-."], ['S', "..."], ['T', "-"], ['U', "..-"], ['V', "...-"], ['W', ".--"], ['X', "-..-"], ['Y', "-.--"], ['Z', "--.."], ['0', "-----"], ['1', ".----"], ['2', "..---"], ['3', "...--"], ['4', "....-"], ['5', "....."], ['6', "-...."], ['7', "--..."], ['8', "---.."], ['9', "----."]]);

var morseMap = new Map([[".-", 'A'], ["-...", 'B'], ["-.-.", 'C'], ["-..", 'D'], [".", 'E'], ["..-.", 'F'], ["--.", 'G'], ["....", 'H'], ["..", 'I'], [".---", 'J'], ["-.-", 'K'], [".-..", 'L'], ["--", 'M'], ["-.", 'N'], ["---", 'O'], [".--.", 'P'], ["--.-", 'Q'], [".-.", 'R'], ["...", 'S'], ["-", 'T'], ["..-", 'U'], ["...-", 'V'], [".--", 'W'], ["-..-", 'X'], ["-.--", 'Y'], ["--..", 'Z'], ["-----", '0'], [".----", '1'], ["..---", '2'], ["...--", '3'], ["....-", '4'], [".....", '5'], ["-....", '6'], ["--...", '7'], ["---..", '8'], ["----.", '9']]);

exports.default = MorseService;