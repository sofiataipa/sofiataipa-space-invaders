const http = require('http');

const hostname = '127.0.0.1'; // proprio comp ; o url 
const port = 3000; // porto

const server = http.createServer((req, res) => { // criar
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World'); // smp que alguem tenta ligar responde 
});

server.listen(port, hostname, () => { // escuta no porto 3000
  console.log(`Server running at http://${hostname}:${port}/`);
});