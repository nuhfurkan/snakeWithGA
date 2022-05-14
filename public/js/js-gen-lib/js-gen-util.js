/**
 * @param {int} len 
 * @returns {string} of random bytes with "len" length
 */
export function createRandomBytes(len) {
    var myNum = "";
    while (myNum.length < len) {
        myNum = myNum + Math.round(Math.random()).toString();
    }
    // console.log(myNum);
    return myNum;
}

/**
 * @param {string} num 
 * @returns {int} binary to decimal value of num
 */
export function binaryToDecimal(num) {
    var pow = 0; 
    var res = 0;
    while (num.length > 0) {
        //console.log(num[num.length-1]);
        if (num[num.length-1] == "1") {
            res += Math.pow(2,pow);
        }
        pow++;
        num = num.slice(0, -1);
    }
    return res;
}

/**
 * 
 * @param {int} min // min value
 * @param {int} max // max value
 * @returns {int} // random number between min and max // min adn max included
 */
export function getRandomInt(min = 0, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 
 * @param {string} str 
 * @param {int} index 
 * @param {any} replacement 
 * @returns {string} with a replaced index
 */
export function repolaceAt(str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index+1);
}

/**
 * 
 * @param {string} str 
 * @param {index} index 
 * @returns {string} of binary bit flipped 
 */
export function bitFlip(str, index=0) {
    if (str.charAt(index) == 0) {
        return repolaceAt(str, index, 1);
    } else {
        return repolaceAt(str, index, 0);
    }
}

export function getRandomFromList(listHere) {
    return listHere[getRandomInt(0, listHere.length-1)];
}