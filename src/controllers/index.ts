import { Response, Request } from 'express';

export const home = (req: Request, res: Response) => {
  return res.send('Eh');
};
