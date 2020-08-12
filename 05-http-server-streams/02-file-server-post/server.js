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
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        return res.end();
      }

      const limitStream = new LimitSizeStream({limit: 1048576});
      const newFileStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req.pipe(limitStream).pipe(newFileStream);

      newFileStream
          .on('finish', () => {
            res.statusCode = 201;
            res.end();
          })
          .on('error', (err) => {
            if (err.code === 'EEXIST') {
              res.statusCode = 409;
              newFileStream._writableState.finished = true;
            } else {
              res.statusCode = 500;
            }
            res.end();
          });

      limitStream
          .on('error', (err) => {
            req.on('end', () => {
              res.end();
            });
            res.statusCode = err.code === 'LIMIT_EXCEEDED' ? 413 : 500;
            req.resume();
          });

      req.on('close', () => {
        limitStream.destroy();
        newFileStream.destroy();
        if (!newFileStream._writableState.finished) {
          fs.remove(filepath);
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});
module.exports = server;