import { Response, Request } from 'express';
import User, { UserModel } from '../models/User';
import {
  DuplicationError,
  handleError,
  InternalServerError,
  InvalidCredentialsError,
} from '../_common/error-handler';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const foundUser: UserModel = await User.findOne({ email });

    if (foundUser) {
      return handleError({ res, err: new DuplicationError() });
    }

    await User.create({ email, password, name });
    return res.status(200).end();
  } catch (err) {
    handleError({ err, res });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const foundUser: UserModel = await User.findOne({ email: email.toLowerCase() });

    if (!foundUser) {
      return handleError({ res, err: new InvalidCredentialsError() });
    }

    foundUser.comparePassword(password, (err: any, isMatch: boolean) => {
      if (err) {
        return handleError({ res, err: new InternalServerError() });
      }
      if (!isMatch) {
        return handleError({ res, err: new InvalidCredentialsError() });
      }
      foundUser.signToken((err: any, accessToken: string) => {
        if (err) {
          return handleError({ res, err: new InternalServerError() });
        }
        const { name, email } = foundUser;
        return res.json({ accessToken, name, email });
      });
    });
  } catch (err) {
    handleError({ err, res });
  }
};
