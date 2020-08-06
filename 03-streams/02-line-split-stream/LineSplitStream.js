const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.line = '';
  }

  _transform(chunk, encoding, callback) {
    chunk = chunk.toString().split(os.EOL);

    if (this.line) {
      this.line += chunk[0];
      chunk.splice(0, 1);
      if (chunk.length) {
        this.push(this.line);
        this.line = '';
      }
    }

    if (chunk.length) {
      for (let i = 0; i < chunk.length - 1; i++) {
        this.push(chunk[i]);
      }
      this.line += chunk[chunk.length - 1];
    }

    callback();
  }

  _flush(callback) {
    if (this.line) {
      this.push(this.line);
    }
    callback();
  }
}

module.exports = LineSplitStream;
