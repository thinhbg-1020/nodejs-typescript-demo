import { Response } from 'express';
import { Error } from 'mongoose';

export interface ErrorHandlerParams {
  err: Error;
  res: Response;
}

export class InvalidCredentialsError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'InvalidCredentialsError';
  }
}

export class InternalServerError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'InternalServerError';
  }
}

export class DuplicationError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'DuplicationError';
  }
}

export const handleError = (params: ErrorHandlerParams) => {
  const { err, res } = params;

  // if (process.env.ENV === 'dev') {
  //   return res.status(400).json(err);
  // }

  switch (err.name) {
    case 'InvalidCredentialsError':
      return res.status(401).json({ error: 'InvalidCredentialsError' });
    case 'CastError' || 'DocumentNotFoundError':
      return res.status(404).json({ error: 'NotFoundError' });
    case 'DuplicationError':
      return res.status(409).json({ error: 'DuplicationError' });
    case 'ValidationError' || 'ValidationError':
      return res.status(400).json({ error: 'ValidationError' });
    default:
      return res.status(500).json({ error: 'InternalServerError' });
  }
};
