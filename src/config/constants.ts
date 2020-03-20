import { Algorithm, SignOptions } from 'jsonwebtoken';

const { JWT_ISSUER, JWT_AUDIENCE, JWT_EXPIRES_IN } = process.env;

export const JWTSignOptions: SignOptions = {
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
  expiresIn: parseInt(JWT_EXPIRES_IN),
  algorithm: 'HS512' as Algorithm
};

export const SchemaName = {
  User: 'User',
  Expense: 'Expense',
  Category: 'Category',
};
