const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/User');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const strategy = new Strategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findByPk(jwt_payload.id);
    return user ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

module.exports = (passport) => {
  passport.use(strategy);
};