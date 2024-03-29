/**
 * jshint esversion: 8
 * Utility functions (helpers)
 * */

const utilities = {};

utilities.escape = (originalText) => {
    if(originalText.includes('+')){
        return originalText.replace(/[+]/g, '\\+');
    }else return originalText;
};


/**
 * will replace all special characters allowing
 * string to be used as url 
 */
utilities.urlify = (url) => {
    if(url.includes('+')){
        url = url.replace(/[+]/g, '%2b');
    }

    return url;
};

utilities.slashSquash = (originalText) => {
    if(originalText.includes('//')){
        text = originalText.replace(/\/\//g, '\/');
        return text;
    }else return originalText;
};

/**
 * Testing utility functions
 * Does not include unit test
 * or intergration testing code.
 * August. 22 2019
 */

const test_utilities = {};

utilities.test_utilities = test_utilities;

utilities.test_utilities.generateDummyItems = generateDummyItems = (display) => {
    let names = [
        'doc.txt',
        'file.docx',
        'sys.tar.gz',
        'text.txt'
    ];
    names.forEach((name) => {
        display.addEntry(name, '-rw-rw--r-', true);
    });
}
