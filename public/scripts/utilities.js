/**
 * jshint esversion: 8
 *  */

const utilities = {};

utilities.escape = (originalText) => {
    if(originalText.includes('+')){
        return originalText.replace('+', '\\+');
    }else return originalText;
};