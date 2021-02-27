const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const { email, displayName, password } = ctx.request.body;

  const userData = {
    email,
    displayName,
    password,
    verificationToken,
  };
  const user = new User(userData);
  await user.setPassword(userData.password);
  try {
    await user.save();
  } catch (err) {
    ctx.status = 400;
    ctx.body = { errors: {} };
    for (const [field, error] of Object.entries(err.errors)) {
      ctx.body.errors[field] = error.message;
    }
    return;
  }

  await sendMail({
    to: email,
    subject: 'Подтверждение регистрации',
    locals: { token: verificationToken },
    template: 'confirmation',
  });

  ctx.body = { status: 'ok' };
  return next();
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }
  user.verificationToken = undefined;
  await user.save();
  ctx.body = { token: await ctx.login(user) };
  return next();
};
