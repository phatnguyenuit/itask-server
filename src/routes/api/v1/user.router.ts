import { Router } from 'express';
import { searchUserTodos } from 'controllers/user/user.controller';

const router = Router({ caseSensitive: true });

router.get('/:userId/todos', searchUserTodos);

export default router;
