const User = require('../../models/User');

module.exports = async (strategy, email, displayName, done) => {
  try {
    if (!email) {
      return done(null, false, 'Не указан email');
    }
    let user = await User.findOne({email});
    if (!user) {
      user = await User.create({email, displayName});
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
};
