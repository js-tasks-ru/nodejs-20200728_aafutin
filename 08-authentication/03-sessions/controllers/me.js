module.exports.me = async (ctx, next) => {
  ctx.body = {
    email: ctx.user.email,
    displayName: ctx.user.displayName,
  };
};
