const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs-extra');
const server = new http.Server();
const LimitSizeStream = require('./LimitSizeStream');

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      res.statusCode = 201;
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        return res.end();
      } else if (await fs.exists(filepath)) {
        res.statusCode = 409;
        return res.end();
      }

      const limitStream = new LimitSizeStream({limit: 1048576});
      const newFileStream = fs.createWriteStream(filepath);

      req.pipe(limitStream).pipe(newFileStream);

      limitStream.on('error', (err) => {
        res.statusCode = err.code === 'LIMIT_EXCEEDED' ? 413 : 500;
        req.resume();
      });

      req.on('close', () => {
        if (!newFileStream._writableState.ended) {
          fs.remove(filepath);
        }
        limitStream.destroy();
        newFileStream.destroy();
      });

      req.on('end', () => {
        res.end();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
