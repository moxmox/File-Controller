/* jshint esversion: 6 */

/***
 * utility functions for automating
 * tasks & testing application components
 */

    generateDummyItems = (display) => {
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