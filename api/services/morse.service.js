import _ from 'lodash';
import {
    MalformedMorseStringError,
    MalformedBitsStringError,
    MalformedAlphaNumericStringError
} from '../errors/client-errors'

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
        let concat = (count, character) => {
            let response = '';
            for (let i = 0; i < count; i++) {
                response = response.concat(character);
            }
            return response;
        }
        let response = "";
        let length = morse.length;
        for (let i = 0; i < length; i++) {
            if (morse.charAt(i) === '.') {
                //placing the 1
                response = response.concat(concat(minOnes, '1'));

                //placing space to separate characters
                response = response.concat(concat(minZeros, '0'));
            }
            else if (morse.charAt(i) === '-') {
                //placing the 1
                response = response.concat(concat(maxOnes, '1'));

                //placing space to separate characters
                response = response.concat(concat(minZeros, '0'));
            }
            else if (morse.charAt(i) === ' ') {
                //find the number of spaces to know if they are 1 or 2 spaces
                if (morse.charAt(i + 1) === ' ') {
                    //is separation of words
                    i++;
                    response = response.concat(concat(maxZeros, '0'));
                } else {
                    //letter separation
                    response = response.concat(concat(mediumZeros, '0'));
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
        let start = bits.indexOf('1'), end = bits.lastIndexOf('1') + 1;

        if (start === -1) throw new MalformedBitsStringError('Bit 1 not found in string', {'msg': 'Bit 1 not found in string'});

        //search ocurrences of zeros and ones
        let count, j;
        let setOnes = new Set();
        let setZeros = new Set();
        for (let i = start; i < end;) {
            //search min and max ocurrence of 1
            if (bits.charAt(i) === '1') {
                j = i;
                count = 0;
                while (j < end && bits.charAt(j) === '1') {
                    count++;
                    j++;
                }
                setOnes.add(count);
            }
            //search min and max ocurrence of 0
            else if (bits.charAt(i) === '0') {
                j = i;
                count = 0;
                while (j < end && bits.charAt(j) === '0') {
                    count++;
                    j++;
                }
                setZeros.add(count);
            }
            else {
                throw new MalformedBitsStringError('Character not a bit', {
                    'msg': 'Character not a bit',
                    'character': bits.charAt(i)
                });
            }
            i = j;
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
        mapOnes.set(ones[0], '.');
        if (ones[1]) mapOnes.set(ones[1], '-');

        //zeros maps for spaces
        let mapZeros = new Map();
        if (zeros[0]) mapZeros.set(zeros[0], '');
        if (zeros[1]) mapZeros.set(zeros[1], ' ');
        if (zeros[2]) mapZeros.set(zeros[2], '  ');

        //loop bits to find dot, dash, pause or long pause
        let response = '';
        for (let i = start; i < end;) {
            //search one
            if (bits.charAt(i) === '1') {
                j = i;
                count = 0;
                while (j < end && bits.charAt(j) === '1') {
                    count++;
                    j++;
                }
                response = response.concat(mapOnes.get(count));
            }
            //search zero
            else {
                j = i;
                count = 0;
                while (j < end && bits.charAt(j) === '0') {
                    count++;
                    j++;
                }
                response = response.concat(mapZeros.get(count));
            }
            i = j;
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
            if (human.charAt(i) === ' ') {
                j = i;
                while (j < length && human.charAt(j) === ' ') j++;
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
                response = response.concat(' ');
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