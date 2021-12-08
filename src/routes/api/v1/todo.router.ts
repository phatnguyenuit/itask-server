import { Router } from 'express';
import {
  createTodo,
  deleteTodo,
  getTodo,
  searchTodos,
  updateTodo,
  verifyTodoId,
} from 'controllers/todo/todo.controller';

const router = Router({ caseSensitive: true });

router.get('/', searchTodos);
router.post('/', createTodo);
router.get('/:id', verifyTodoId, getTodo);
router.patch('/:id', verifyTodoId, updateTodo);
router.delete('/:id', verifyTodoId, deleteTodo);

export default router;
