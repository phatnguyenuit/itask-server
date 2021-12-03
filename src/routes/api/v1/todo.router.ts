import { Router } from 'express';
import { searchTodos } from 'controllers/todo.controllers';

const router = Router({ caseSensitive: true });

router.get('/', searchTodos);

export default router;
