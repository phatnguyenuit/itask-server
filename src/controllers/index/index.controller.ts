import { RequestHandler } from 'express';

export const greet: RequestHandler = (req, res) => {
  res.json({
    message: 'Welcome to iTask server',
    ip: req.ip,
  });
};
