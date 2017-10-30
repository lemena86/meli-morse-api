import _ from 'lodash';
import {
    MalformedMorseStringError,
    MalformedBitsStringError,
    MalformedAlphaNumericStringError
} from '../errors/client-errors'

const DOT = '.';
const DASH = '-';
const ONE_SPACE = ' ';
const TWO_SPACES = '  ';
const ZERO = '0';
const ONE = '1';
const MorseService = {
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
    encodeMorse2Bits: (morse, minOnes = 1, maxOnes = 2, minZeros = 1, mediumZeros = 1, maxZeros = 2) => {
        let _concat = (count, character) => {
            let response = '';
            for (let i = 0; i < count; i++) {
                response = response.concat(character);
            }
            return response;
        }
        let response = "";
        let length = morse.length;
        for (let i = 0; i < length; i++) {
            if (morse.charAt(i) === DOT) {
                //placing the 1
                response = response.concat(_concat(minOnes, ONE));

                //placing space to separate characters
                response = response.concat(_concat(minZeros, ZERO));
            }
            else if (morse.charAt(i) === DASH) {
                //placing the 1
                response = response.concat(_concat(maxOnes, ONE));

                //placing space to separate characters
                response = response.concat(_concat(minZeros, ZERO));
            }
            else if (morse.charAt(i) === ONE_SPACE) {
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
            else {
                throw new MalformedMorseStringError('Character not in morse', {
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
    decodeBits2Morse: (bits) => {
        //first and last ocurrence of 1
        let start = bits.indexOf(ONE), end = bits.lastIndexOf(ONE) + 1;
        if (start === -1) throw new MalformedBitsStringError('Bit 1 not found in string', {'msg': 'Bit 1 not found in string'});

        //find count of consecutive characters
        let _getCount = (character, start, end) => {
            let j = start, count = 0;
            while (j < end && bits.charAt(j) === character) {
                count++;
                j++;
            }
            return {'count': count, 'j': j};
        }

        //search ocurrences of zeros and ones
        let getCountResult = {};
        let setOnes = new Set();
        let setZeros = new Set();
        let array = [];

        for (let i = start; i < end;) {
            //search ocurrence of 1
            if (bits.charAt(i) === ONE) {
                getCountResult = _getCount(bits.charAt(i), i, end);
                setOnes.add(getCountResult['count']);
                array.push({'character': ONE, 'count': getCountResult['count']});
                i = getCountResult['j'];
            }
            //search ocurrence of 0
            else if (bits.charAt(i) === ZERO) {
                getCountResult = _getCount(bits.charAt(i), i, end);
                setZeros.add(getCountResult['count']);
                array.push({'character': ZERO, 'count': getCountResult['count']});
                i = getCountResult['j'];
            }
            else {
                throw new MalformedBitsStringError('Character not a bit', {
                    'msg': 'Character not a bit',
                    'character': bits.charAt(i)
                });
            }
        }
        //verify sets
        if (setOnes.size > 2) throw new MalformedBitsStringError(
            'More than two ones in a row in the string (e.g 10110111)',
            {'msg': 'More than two ones in a row in the string (e.g 10110111)'}
        );
        //para los zeros el maximo es 3
        if (setZeros.size > 3) throw new MalformedBitsStringError(
            'More than three zeros in a row in the string (e.g 10110010001000010)',
            {'msg': 'More than three zeros in a row in the string (e.g 10110010001000010)'});

        //order setOnes and Zeros
        const ones = _.sortBy([...setOnes]);
        const zeros = _.sortBy([...setZeros]);

        //ones map with for the dots(.) and the dash(-)
        let mapOnes = new Map();
        mapOnes.set(ones[0], DOT);
        if (ones[1]) mapOnes.set(ones[1], DASH);

        //zeros map for spaces
        let mapZeros = new Map();
        if (zeros[0]) mapZeros.set(zeros[0], '');
        if (zeros[1]) mapZeros.set(zeros[1], ONE_SPACE);
        if (zeros[2]) mapZeros.set(zeros[2], TWO_SPACES);

        //loop for array to create the response
        let response = '';
        for (const obj of array) {
            if (obj['character'] === ONE)
                response = response.concat(mapOnes.get(obj['count']))
            else
                response = response.concat(mapZeros.get(obj['count']))
        }

        return response;
    },
    /**
     * Given a morse code it returns its equivalent in alphanumeric text
     *
     * @param morse string in morse code
     * @returns {string} string in alphanumeric text
     */
    translate2Human: (morse) => {
        let response = '', letter, length = morse.length, j, count, human;
        for (let i = 0; i < length;) {
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
                if (!_.isUndefined(human)) response = response.concat(human);
                else throw new MalformedMorseStringError(
                    'Morse letter not valid',
                    {'msg': 'Morse letter not valid', 'letter': letter});
            } else {
                throw new MalformedMorseStringError(
                    'Character not in morse',
                    {'msg': 'Character not in morse', 'character': morse.charAt(i)});
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
    encode2Morse: (human) => {
        human = human.toUpperCase();
        let response = '', length = human.length, j, morse;
        for (let i = 0; i < length;) {
            if (human.charAt(i) === ONE_SPACE) {
                j = i;
                while (j < length && human.charAt(j) === ONE_SPACE) j++;
                i = j;
            } else {
                morse = alphaMap.get(human.charAt(i));
                if (!_.isUndefined(morse)) response = response.concat(morse);
                else throw new MalformedAlphaNumericStringError(
                    'AlphaNumeric not valid',
                    {'msg': 'AlphaNumeric not valid', 'character': human.charAt(i)});
                i++;
            }
            if (i < length)
                response = response.concat(ONE_SPACE);
        }
        return response;
    }

}
const alphaMap = new Map([
    ['A', ".-"],
    ['B', "-..."],
    ['C', "-.-."],
    ['D', "-.."],
    ['E', "."],
    ['F', "..-."],
    ['G', "--."],
    ['H', "...."],
    ['I', ".."],
    ['J', ".---"],
    ['K', "-.-"],
    ['L', ".-.."],
    ['M', "--"],
    ['N', "-."],
    ['O', "---"],
    ['P', ".--."],
    ['Q', "--.-"],
    ['R', ".-."],
    ['S', "..."],
    ['T', "-"],
    ['U', "..-"],
    ['V', "...-"],
    ['W', ".--"],
    ['X', "-..-"],
    ['Y', "-.--"],
    ['Z', "--.."],
    ['0', "-----"],
    ['1', ".----"],
    ['2', "..---"],
    ['3', "...--"],
    ['4', "....-"],
    ['5', "....."],
    ['6', "-...."],
    ['7', "--..."],
    ['8', "---.."],
    ['9', "----."]
]);

const morseMap = new Map([
    [".-", 'A'],
    ["-...", 'B'],
    ["-.-.", 'C'],
    ["-..", 'D'],
    [".", 'E'],
    ["..-.", 'F'],
    ["--.", 'G'],
    ["....", 'H'],
    ["..", 'I'],
    [".---", 'J'],
    ["-.-", 'K'],
    [".-..", 'L'],
    ["--", 'M'],
    ["-.", 'N'],
    ["---", 'O'],
    [".--.", 'P'],
    ["--.-", 'Q'],
    [".-.", 'R'],
    ["...", 'S'],
    ["-", 'T'],
    ["..-", 'U'],
    ["...-", 'V'],
    [".--", 'W'],
    ["-..-", 'X'],
    ["-.--", 'Y'],
    ["--..", 'Z'],
    ["-----", '0'],
    [".----", '1'],
    ["..---", '2'],
    ["...--", '3'],
    ["....-", '4'],
    [".....", '5'],
    ["-....", '6'],
    ["--...", '7'],
    ["---..", '8'],
    ["----.", '9']
]);

export default MorseService;