import { Router } from 'express';

const router = Router({ caseSensitive: true });

router.get('/:userId/todos', (req, res) => {
  const search = new URLSearchParams({
    ...req.query,
    userId: req.params.userId,
  });

  return res.redirect(`/api/v1/todos?${search}`);
});

export default router;
