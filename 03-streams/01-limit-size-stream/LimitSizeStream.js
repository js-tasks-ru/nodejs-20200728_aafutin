const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super({encoding: options.encoding});
    this.limit = options.limit;
    this.bytes_passed = 0;
  }

  _transform(chunk, encoding, callback) {
    this.bytes_passed += chunk.length;
    if (this.bytes_passed > this.limit) {
      callback(new LimitExceededError);
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
