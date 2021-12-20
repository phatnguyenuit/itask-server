import { Router } from 'express';

import authRoutes from './auth.router';
import userRoutes from './user.router';
import todoRoutes from './todo.router';

const router = Router({ caseSensitive: true });

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/todos', todoRoutes);

export default router;
