import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import { JWTSignOptions, SchemaName } from '../config/constants';
import { Response } from 'express';

const Schema = mongoose.Schema;

type ComparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: boolean) => void | Response) => void;

type SignTokenFunction = (cb: (err: any, token: any) => void | Response) => void;

export type UserModel = mongoose.Document & {
  name: string,
  email: string,
  password: string,
  comparePassword: ComparePasswordFunction,
  signToken: SignTokenFunction
};

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (password: string) => /([A-Za-z0-9]){8,32}$/.test(password)
    }
  }
});

/**
 * Password hash middleware
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

const comparePassword: ComparePasswordFunction = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

const signToken: SignTokenFunction = function (cb) {
  const { email, name } = this;
  const { JWT_SECRET } = process.env;
  jwt.sign(
    { email, name },
    JWT_SECRET,
    JWTSignOptions,
    (err: Error, token: string) => {
      cb(err, token);
    }
  );
};

userSchema.methods.comparePassword = comparePassword;

userSchema.methods.signToken = signToken;

const User = mongoose.model<UserModel>(SchemaName.User, userSchema);

export default User;
