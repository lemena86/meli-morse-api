import _ from 'lodash';

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
                throw 'Malformed morse string';
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

        if (start === -1) throw 'Malformed bits string';

        //search min and max ocurrence of 0 and 1
        let minZero = Number.MAX_VALUE, maxZero = 0, minOne = Number.MAX_VALUE, maxOne = 0, count, j;

        for (let i = start; i < end;) {
            //search min and max ocurrence of 1
            if (bits.charAt(i) === '1') {
                j = i;
                count = 0;
                while (j < end && bits.charAt(j) === '1') {
                    count++;
                    j++;
                }
                if (count < minOne) minOne = count;
                if (count > maxOne) maxOne = count;
            }
            //search min and max ocurrence of 0
            else if (bits.charAt(i) === '0') {
                j = i;
                count = 0;
                while (j < end && bits.charAt(j) === '0') {
                    count++;
                    j++;
                }
                if (count < minZero) minZero = count;
                if (count > maxZero) maxZero = count;
            }
            else {
                throw 'Malformed bits string';
            }
            i = j;
        }
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
                if (count === minOne) response = response.concat(".");
                else if (count === maxOne) response = response.concat("-");
            }
            //search zero
            else {
                j = i;
                count = 0;
                while (j < end && bits.charAt(j) === '0') {
                    count++;
                    j++;
                }
                if (count === minZero) {
                }
                else if (count === maxZero) response = response.concat("  ");//letter separator
                else response = response.concat(" ");//words separator
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
                else throw 'Malformed morse string';
            } else {
                throw 'Malformed morse string';
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
                else throw 'Malformed human string';
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