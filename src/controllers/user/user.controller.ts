import { RequestHandler } from 'express';

export const searchUserTodos: RequestHandler = (req, res) => {
  const search = new URLSearchParams({
    ...req.query,
    userId: req.params.userId,
  });

  return res.redirect(`/api/v1/todos?${search}`);
};
