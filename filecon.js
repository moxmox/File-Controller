/**
 * jshint esversion: 8
 */

const express = require('express')
const server = require('./modules/server')
const IO = require('./modules/IO')
const HOME_DIR = '/home';

//init server
if(!server.init(process.argv.slice(2, process.argv.length))){
    console.error('server not initialized');
    return
}

const app = express()

//configure routes
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/file_controller.html`);
});

app.get('/home_dir', (req, res) => {

    IO.listAll(HOME_DIR).then((result) => {
        return IO.getStats(result, HOME_DIR);
    }).then(value => {
        res.json(value);
    });

});

app.get('/files', (req, res) => {

    let path = `${HOME_DIR}${req.query.dir_path}/`;
    IO.listAll(path).then((result) => {
        return IO.getStats(result, path);
    }).then(value => {
        res.json(value);
    }).catch(error => {console.log(error)});

});

app.get('/move', (req, res) => {
    console.log(`file=${req.query.file}, dest=${req.query.dest}`);
    let oldPath = `${HOME_DIR}${req.query.oldPath}${req.query.file}`;
    let newPath = `${HOME_DIR}${req.query.dest}/${req.query.file}`;
    IO.moveFile(oldPath, newPath).then(() => {
        console.log('moveFile result');
        res.json({code: 'success'});
    }).catch(error => {
        console.error(error);
    });
});

//start listening
app.listen(server.port, server.ipaddr, () => {
    console.log(`listening on: \n{\n\taddr: ${server.ipaddr}, \n\tport: ${server.port}\n} \n\n^C to Exit . . .`);
});