const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs-extra');
const server = new http.Server();

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      res.statusCode = 200;
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        return res.end();
      } else if (!await fs.exists(filepath)) {
        res.statusCode = 404;
        return res.end();
      }
      await fs.remove(filepath).catch((err) => {
        res.statusCode = 500;
      });
      res.end();

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
