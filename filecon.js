/**
 * jshint esversion: 8
 */

const express = require('express')
const fs = require('fs')
const server = require('./modules/server')
const IO = require('./modules/IO')

//init server
if(!server.init(process.argv.slice(2, process.argv.length))){
    return
}

const app = express()

//configure routes
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/file_controller.html`);
});

app.get('/home_dir', (req, res) => {

    IO.listAll().then((result) => {
        console.log(result);
        return IO.getStats(result, '/home/');
    }).then(value => {
        res.json(value);
    });

});

//start listening
app.listen(server.port, server.ipaddr, () => {
    console.log(`listening on: \n{\n\taddr: ${server.ipaddr}, \n\tport: ${server.port}\n} \n\n^C to Exit . . .`);
});