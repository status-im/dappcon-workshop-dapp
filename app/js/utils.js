/**
 * Builds a URL
 * 
 * @param {string} strToShorten string to shorten.
 * @param {int} maxLength maximum length of string before appending the delimiter.
 * @param {string} delimiter string to append on the end, defaults to '…'
 * @returns {string} the shortened string
 */
function limitLength (strToShorten, maxLength, delimiter){
    if(!strToShorten) return '';

    if(strToShorten.length > maxLength){
        strToShorten = strToShorten.substring(0, maxLength) + (delimiter || '…');
    }
    return strToShorten;
  }
  
  module.exports = {
    limitLength: limitLength
  }