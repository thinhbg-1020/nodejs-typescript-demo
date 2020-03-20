import { Response, Request } from 'express';
import User, { UserModel } from '../models/User';

export const getCurrentUserProfile = (req: Request, res: Response) => {
  const { email, name } = req.user;
  res.json({ email, name });
};

export const updateCurrentUserProfile = (req: Request, res: Response) => {
  const { email } = req.user;
  const { newEmail, newPassword, newName } = req.body;
  User.findOne({ email }, (err, user: UserModel) => {
    if (err) {
      return res.status(500).end();
    }
    if (!user) {
      return res
        .status(404)
        .json({ messageCode: 'user_not_found' });
    }
    if (newEmail) {
      user.email = newEmail;
    }
    if (newName) {
      user.name = newName;
    }
    if (newPassword) {
      user.password = newPassword;
    }
    user.save((err) => {
      if (err) {
        if ('ValidationError' === err.name) {
          return res
            .status(500)
            .json({
              messageCode: 'missing_or_invalid_fields'
            });
        }
        return res.status(500).end();
      }
      return res.status(200).end();
    });
  });
};
