import { Router } from 'express';
import userRoutes from './user.router';
import todoRoutes from './todo.router';

const router = Router({ caseSensitive: true });

router.use('/users', userRoutes);
router.use('/todos', todoRoutes);

export default router;
