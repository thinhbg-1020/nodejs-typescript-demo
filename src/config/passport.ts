import passport from 'passport';
import passportJwt, { StrategyOptions } from 'passport-jwt';
import { JWTSignOptions } from './constants';
import User from '../models/User';
import { JwtPayload } from 'jwt-payload';
const { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } = process.env;

const JwtStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

const options: StrategyOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
  algorithms: [JWTSignOptions.algorithm],
};

passport.use(new JwtStrategy(options, (jwtPayload: JwtPayload, done) => {
  User.findOne({ email: jwtPayload.email }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(undefined, user);
    } else {
      return done(undefined, false);
    }
  });
}));

export const isAuthenticated = passport.authenticate('jwt', { session: false });
