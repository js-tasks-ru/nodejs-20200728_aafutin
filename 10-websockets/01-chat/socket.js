const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    try {
      const {token} = socket.handshake.query;
      if (!token) {
        throw new Error('anonymous sessions are not allowed');
      }
      const session = await Session.findOne({token}).populate('user');
      if (!session) {
        throw new Error('wrong or expired session token');
      }
      socket.user = session.user;
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      try {
        await Message.create({
          date: new Date(),
          text: msg,
          chat: socket.user.id,
          user: socket.user.displayName,
        });
      } catch (err) {
        console.log(err);
      }
    });
  });

  return io;
}

module.exports = socket;
