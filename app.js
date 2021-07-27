//require node modules
const http = require('http');
//file imports
const respond = require('./lib/respond.js');
//connection settings
const port = process.env.port || 4000;
//create createServer

const server = http.createServer(respond);

//listens to requests
server.listen(port,()=> {
  console.log(`listening on port: ${port}`);
});
