const express = require('express')
const server = require('./modules/server')

//init server
if(!server.init(process.argv.slice(2, process.argv.length))){
    return
}

const app = express()

//configure routes
app.use('/public', express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/file_controller.html`)
})

//start listening
app.listen(server.port, server.ipaddr, () => {
    console.log(`listening on: \n{\n\taddr: ${server.ipaddr}, \n\tport: ${server.port}\n} \n\n^C to Exit . . .`)
})