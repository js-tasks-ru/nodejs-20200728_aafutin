const Session = require('../models/Session');

module.exports.me = async (ctx, next) => {
  const {token} = ctx;
  if (!token) {
    return next();
  } else {
    const session = await Session.findOne({token}).populate('user');
    if (!session) {
      ctx.status = 401;
      ctx.body = {error: 'Неверный аутентификационный токен'};
    } else {
      session.lastVisit = new Date();
      await session.save();
      ctx.user = session.user;
      ctx.body = {
        email: ctx.user.email,
        displayName: ctx.user.displayName,
      };
    }
  }
};
