const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super({encoding: options.encoding});
    this.limit = options.limit;
    this.chunks = 0;
  }

  _transform(chunk, encoding, callback) {
    this.chunks++;
    if (this.chunks > this.limit) {
      callback(new LimitExceededError);
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
